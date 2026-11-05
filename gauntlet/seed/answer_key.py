#!/usr/bin/env python3
"""Render gauntlet/ANSWER-KEY.md from gauntlet/manifest.json (+ verify-results.json when present)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
m = json.loads((ROOT / "gauntlet" / "manifest.json").read_text())
vr_path = ROOT / "gauntlet" / "verify-results.json"
verified = {r["id"]: r for r in json.loads(vr_path.read_text())["results"]} if vr_path.exists() else {}

out = ["# Answer key — do not read before scoring", "",
       "The truth for every seeded PR. PR descriptions are deliberately written as ordinary dev PRs and never mention the regression.", "",
       f"Base commit: `{m['base_commit']}`. Branch = PR head. `files` is the full list of files touched by the PR.", "", "## Bugs", ""]
for b in m["bugs"]:
    v = verified.get(b["id"])
    status = ("verified" if v and v["verified"] else ("NOT verified" if v else "unverified")) 
    out += [f"### {b['id']} — {b['title']}", "",
            f"- Branch: `{b['branch']}`" + (f" — PR: {b['pr']}" if b.get("pr") else ""),
            f"- Class: **{b['class']}** · severity: {b['severity']} · expected detection: {b['expected_detection']}",
            f"- Flows: {', '.join(b['flows'])} · devices: {', '.join(b['devices'])} · browsers: {', '.join(b['browsers'])} · network: {b['network']}",
            f"- Files: {', '.join('`' + f + '`' for f in b['files'])}",
            f"- Repro: {b['repro']}",
            f"- Proof: `{b['proof']['spec']}` on project `{b['proof']['project']}` ({status})", ""]
out += ["## Controls (no regression)", ""]
for c in m["controls"]:
    out += [f"- {c['id']} `{c['branch']}` — {c['kind']}: {c['title']}" + (f" — {c['pr']}" if c.get("pr") else "")]
(ROOT / "gauntlet" / "ANSWER-KEY.md").write_text("\n".join(out) + "\n")
print("wrote gauntlet/ANSWER-KEY.md")
