#!/usr/bin/env python3
"""Create the seeded bug/control branches (and PRs) from a base commit, and write gauntlet/manifest.json.

Usage:
  python3 gauntlet/seed/seed.py --manifest                 # (re)write manifest.json only
  python3 gauntlet/seed/seed.py --branches [--push] [--pr] # create branches in git worktrees
  python3 gauntlet/seed/seed.py --only 01,05 --branches    # subset
Options:
  --base <ref>     commit to branch from (default: origin/main merge-base = the recorded base_commit if present)
  --check          run `tsc --noEmit` + `eslint` in each worktree after applying the edit
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE))
from bugs_a import BUGS_A  # noqa: E402
from bugs_b import BUGS_B  # noqa: E402
from controls import CONTROLS  # noqa: E402

BUGS = sorted(BUGS_A + BUGS_B, key=lambda b: b["id"])
WORKTREES = Path(os.environ.get("GAUNTLET_WORKTREES", "/tmp/gauntlet-worktrees"))
MANIFEST = ROOT / "gauntlet" / "manifest.json"

CLASSES = {
    "functional": "Core behaviour is wrong (totals, counts, ordering, no-op buttons).",
    "mobile-only": "Only manifests on phone-width viewports / touch devices.",
    "browser-specific": "Only manifests in one browser engine (WebKit/Safari or Firefox).",
    "network-perf": "Only manifests under latency, throttling or payload-size pressure.",
    "state-persistence": "A write appears to succeed but state is lost after a reload or redirect.",
    "a11y-usability": "Keyboard, screen-reader or contrast regressions; the mouse path still works.",
    "visual-layout": "Overflow, clipping or overlap that does not break functionality outright.",
    "silent-failure": "The UI reports success or an empty state while the underlying operation failed.",
}
FLOWS = ["browse", "product", "cart", "checkout", "auth", "search-filter", "settings", "newsletter", "mobile-nav"]


def sh(cmd: list[str], cwd: Path | None = None, check: bool = True, capture: bool = False) -> str:
    r = subprocess.run(cmd, cwd=cwd, check=check, text=True, capture_output=capture)
    return (r.stdout or "").strip() if capture else ""


def branch_name(kind: str, item: dict) -> str:
    return f"{kind}/{item['id']}-{item['slug']}"


# --- special, non-literal edits used by the control PRs -----------------------------------------

def extract_nav(wt: Path) -> list[str]:
    header = wt / "components" / "Header.tsx"
    s = header.read_text()
    m = re.search(r"const NAV = \[\n(?:.*\n)*?\];\n\n", s)
    assert m, "NAV block not found"
    block = m.group(0)
    s = s.replace(block, "")
    last_import = list(re.finditer(r"^import .*;\n", s, re.M))[-1]
    s = s[: last_import.end()] + 'import { NAV } from "@/lib/nav";\n' + s[last_import.end():]
    header.write_text(s)
    (wt / "lib" / "nav.ts").write_text("export " + block.rstrip("\n") + "\n")
    return ["components/Header.tsx", "lib/nav.ts"]


def extract_field(wt: Path) -> list[str]:
    form = wt / "app" / "checkout" / "CheckoutForm.tsx"
    s = form.read_text()
    idx = s.index("\nfunction Field(")
    field_src = s[idx + 1 :]
    s = s[:idx].rstrip("\n") + "\n"
    s = s.replace('import { useCart } from "@/components/CartProvider";\n', 'import { useCart } from "@/components/CartProvider";\nimport { Field } from "./Field";\n')
    form.write_text(s)
    field_src = "export " + field_src.replace("id: Fields;", "id: string;")
    (wt / "app" / "checkout" / "Field.tsx").write_text(field_src)
    return ["app/checkout/CheckoutForm.tsx", "app/checkout/Field.tsx"]


def append_first_paragraph(wt: Path, rel: str, text: str) -> list[str]:
    p = wt / rel
    s = p.read_text()
    start = s.index("<p ")
    end = s.index("</p>", start)
    head = s[:end].rstrip()
    indent = re.search(r"\n([ \t]*)$", s[:end]).group(1)
    p.write_text(head + text + "\n" + indent + s[end:])
    return [rel]


def apply_edits(wt: Path, item: dict) -> list[str]:
    files: list[str] = []
    for rel, old, new in item["edits"]:
        if old == "__EXTRACT_NAV__":
            files += extract_nav(wt)
            continue
        if old == "__EXTRACT_FIELD__":
            files += extract_field(wt)
            continue
        if old == "__APPEND_FIRST_PARAGRAPH__":
            files += append_first_paragraph(wt, rel, new)
            continue
        p = wt / rel
        s = p.read_text()
        n = s.count(old)
        assert n == 1, f"{item['id']}: expected exactly one match in {rel}, found {n}:\n{old}"
        p.write_text(s.replace(old, new))
        if rel not in files:
            files.append(rel)
    if item.get("generate") == "hero-png":
        sh(["node", str(HERE / "make-hero-png.mjs"), str(wt / "public" / "hero.png")])
        files.append("public/hero.png")
    return files


def files_for(item: dict) -> list[str]:
    out: list[str] = []
    for rel, old, _ in item["edits"]:
        if old == "__EXTRACT_NAV__":
            out += ["components/Header.tsx", "lib/nav.ts"]
        elif old == "__EXTRACT_FIELD__":
            out += ["app/checkout/CheckoutForm.tsx", "app/checkout/Field.tsx"]
        elif rel not in out:
            out.append(rel)
    if item.get("generate") == "hero-png":
        out.append("public/hero.png")
    return out


# --- branch creation --------------------------------------------------------------------------

def make_branch(kind: str, item: dict, base: str, push: bool, pr: bool, check: bool) -> str | None:
    branch = branch_name(kind, item)
    wt = WORKTREES / branch.replace("/", "__")
    if wt.exists():
        sh(["git", "worktree", "remove", "--force", str(wt)], cwd=ROOT)
    sh(["git", "worktree", "prune"], cwd=ROOT)
    if sh(["git", "branch", "--list", branch], cwd=ROOT, capture=True):
        sh(["git", "branch", "-D", branch], cwd=ROOT)
    sh(["git", "worktree", "add", "-q", "-b", branch, str(wt), base], cwd=ROOT)
    files = apply_edits(wt, item)
    if check:
        if not (wt / "node_modules").exists():
            os.symlink(ROOT / "node_modules", wt / "node_modules")
        sh(["npx", "tsc", "--noEmit"], cwd=wt)
        sh(["npx", "eslint", "."], cwd=wt)
    sh(["git", "add", "-A"], cwd=wt)
    msg = item["title"] + "\n\n" + item["body"]
    sh(["git", "commit", "-q", "-m", msg], cwd=wt)
    print(f"  {branch}: {', '.join(files)}")
    url = None
    if push:
        sh(["git", "push", "-q", "--force-with-lease", "-u", "origin", branch], cwd=wt)
    if pr:
        existing = sh(["gh", "pr", "list", "--head", branch, "--state", "open", "--json", "url", "--jq", ".[0].url"], cwd=ROOT, capture=True)
        if existing:
            url = existing
        else:
            url = sh(["gh", "pr", "create", "--base", "main", "--head", branch, "--title", item["title"], "--body", item["body"]], cwd=ROOT, capture=True).splitlines()[-1]
        print(f"    PR: {url}")
    return url


def write_manifest(base: str, pr_urls: dict[str, str]) -> None:
    prev = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    prev_prs = {b["branch"]: b.get("pr") for b in prev.get("bugs", []) + prev.get("controls", [])}
    bugs = []
    for b in BUGS:
        br = branch_name("bug", b)
        bugs.append({
            "id": f"BUG-{b['id']}", "branch": br, "pr": pr_urls.get(br) or prev_prs.get(br),
            "class": b["class"], "title": b["title"], "severity": b["severity"],
            "flows": b["flows"], "devices": b["devices"], "browsers": b["browsers"], "network": b["network"],
            "expected_detection": b["detection"], "repro": b["repro"], "files": files_for(b),
            "proof": {"spec": f"gauntlet/proofs/{b['proof']['spec']}", "project": b["proof"]["project"]},
        })
    controls = []
    for c in CONTROLS:
        br = branch_name("control", c)
        controls.append({"id": f"CTL-{c['id']}", "branch": br, "pr": pr_urls.get(br) or prev_prs.get(br), "kind": c["kind"], "title": c["title"], "files": files_for(c)})
    manifest = {
        "version": 1,
        "app": "Gauntlet Shop",
        "repo": "https://github.com/sharonbasovich/regression-gauntlet",
        "base_commit": base,
        "generated_at": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "expected_detection_legend": {
            "scripted": "A deterministic happy-path spec of the affected flow fails on the branch.",
            "journey": "Needs a specific multi-step or state-asserting journey (reload, second click, two variants, redirect).",
            "judgement": "Needs a non-default condition (throttled network, real device, specific engine) or visual/UX/a11y judgement.",
        },
        "classes": CLASSES,
        "flows": FLOWS,
        "devices": ["desktop (1440)", "tablet (834)", "mobile (390)"],
        "bugs": bugs,
        "controls": controls,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {MANIFEST.relative_to(ROOT)}: {len(bugs)} bugs, {len(controls)} controls")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base")
    ap.add_argument("--only")
    ap.add_argument("--branches", action="store_true")
    ap.add_argument("--push", action="store_true")
    ap.add_argument("--pr", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--manifest", action="store_true")
    ap.add_argument("--skip-controls", action="store_true")
    ap.add_argument("--skip-bugs", action="store_true")
    a = ap.parse_args()

    base = a.base
    if not base and MANIFEST.exists():
        base = json.loads(MANIFEST.read_text()).get("base_commit")
    if not base:
        base = sh(["git", "rev-parse", "HEAD"], cwd=ROOT, capture=True)
    base = sh(["git", "rev-parse", base], cwd=ROOT, capture=True)
    only = set(a.only.split(",")) if a.only else None

    pr_urls: dict[str, str] = {}
    if a.branches:
        WORKTREES.mkdir(parents=True, exist_ok=True)
        items = ([] if a.skip_bugs else [("bug", b) for b in BUGS]) + ([] if a.skip_controls else [("control", c) for c in CONTROLS])
        for kind, item in items:
            if only and item["id"] not in only:
                continue
            url = make_branch(kind, item, base, a.push, a.pr, a.check)
            if url:
                pr_urls[branch_name(kind, item)] = url
    if a.manifest or a.branches:
        write_manifest(base, pr_urls)


if __name__ == "__main__":
    main()
