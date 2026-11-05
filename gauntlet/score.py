#!/usr/bin/env python3
"""Score a tester report against gauntlet/manifest.json.

    python3 gauntlet/score.py <report.json> [--manifest gauntlet/manifest.json] [--json out.json]

A PR is FLAGGED when any observation has verdict "broken".
  TP: bug PR flagged      FN: bug PR not flagged (or missing from the report)
  FP: control PR flagged  TN: control PR not flagged
Precision/recall/F1 are reported overall, per bug class (recall; controls carry no class),
per device (a bug counts for device D if D is in its `devices`; detection on D counts if a
"broken" observation names D) and per expected-detection tier. "Localised" means at least
one broken observation names a flow the manifest lists for that bug.
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

BROKEN = {"broken", "fail", "failed", "regression"}


def prf(tp: int, fp: int, fn: int) -> tuple[float, float, float]:
    p = tp / (tp + fp) if tp + fp else 0.0
    r = tp / (tp + fn) if tp + fn else 0.0
    f = 2 * p * r / (p + r) if p + r else 0.0
    return p, r, f


def table(headers: list[str], rows: list[list[str]]) -> str:
    widths = [max(len(str(c)) for c in col) for col in zip(headers, *rows)] if rows else [len(h) for h in headers]
    fmt = "  ".join(f"{{:<{w}}}" for w in widths)
    out = [fmt.format(*headers), fmt.format(*["-" * w for w in widths])]
    out += [fmt.format(*[str(c) for c in r]) for r in rows]
    return "\n".join(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("report")
    ap.add_argument("--manifest", default=str(Path(__file__).with_name("manifest.json")))
    ap.add_argument("--json", help="also write machine-readable results here")
    a = ap.parse_args()

    manifest = json.loads(Path(a.manifest).read_text())
    report = json.loads(Path(a.report).read_text())

    prs = report.get("prs", [])
    if isinstance(prs, dict):  # also accept {"branch": [observations]} shorthand
        prs = [{"branch": k, "observations": v} for k, v in prs.items()]
    by_branch: dict[str, list[dict]] = {}
    for entry in prs:
        by_branch.setdefault(entry["branch"], []).extend(entry.get("observations", []))

    def broken_obs(branch: str) -> list[dict]:
        return [o for o in by_branch.get(branch, []) if str(o.get("verdict", "")).lower() in BROKEN]

    rows: list[list[str]] = []
    per_class: dict[str, dict[str, int]] = defaultdict(lambda: {"tp": 0, "fn": 0})
    per_tier: dict[str, dict[str, int]] = defaultdict(lambda: {"tp": 0, "fn": 0})
    per_device: dict[str, dict[str, int]] = defaultdict(lambda: {"tp": 0, "fn": 0, "fp": 0})
    per_pr: list[dict] = []
    tp = fn = fp = tn = 0
    localised = 0
    missing: list[str] = []

    for bug in manifest["bugs"]:
        br = bug["branch"]
        obs = broken_obs(br)
        reported = br in by_branch
        if not reported:
            missing.append(br)
        hit = bool(obs)
        flows = sorted({o.get("flow", "?") for o in obs})
        devices = sorted({o.get("device", "?") for o in obs})
        loc = hit and bool(set(flows) & set(bug["flows"]))
        tp += hit
        fn += not hit
        localised += loc
        per_class[bug["class"]]["tp" if hit else "fn"] += 1
        per_tier[bug["expected_detection"]]["tp" if hit else "fn"] += 1
        for d in bug["devices"]:
            per_device[d]["tp" if d in devices else "fn"] += 1
        result = "TP" if hit else ("FN" if reported else "FN (not in report)")
        rows.append([bug["id"], bug["class"], bug["expected_detection"], bug["severity"], result, ",".join(flows) or "-", ",".join(devices) or "-", "yes" if loc else ("no" if hit else "-")])
        per_pr.append({"id": bug["id"], "branch": br, "kind": "bug", "class": bug["class"], "expected_detection": bug["expected_detection"], "flagged": hit, "result": result, "flows_flagged": flows, "devices_flagged": devices, "localised": loc, "notes": [o.get("note", "") for o in obs]})

    for ctl in manifest["controls"]:
        br = ctl["branch"]
        obs = broken_obs(br)
        reported = br in by_branch
        if not reported:
            missing.append(br)
        hit = bool(obs)
        fp += hit
        tn += not hit
        for o in obs:
            per_device[o.get("device", "?")]["fp"] += 1
        result = "FP" if hit else "TN"
        rows.append([ctl["id"], f"control/{ctl['kind']}", "-", "-", result, ",".join(sorted({o.get("flow", "?") for o in obs})) or "-", ",".join(sorted({o.get("device", "?") for o in obs})) or "-", "-"])
        per_pr.append({"id": ctl["id"], "branch": br, "kind": "control", "flagged": hit, "result": result, "notes": [o.get("note", "") for o in obs]})

    p, r, f = prf(tp, fp, fn)
    print(f"Regression Gauntlet score — tester: {report.get('tester', '?')}  (manifest base {manifest.get('base_commit', '?')[:10]})\n")
    print(table(["PR", "class", "tier", "sev", "result", "flows flagged", "devices flagged", "localised"], rows))
    print()
    print(f"Overall (PR level): TP={tp} FN={fn} FP={fp} TN={tn}")
    print(f"  precision={p:.2f}  recall={r:.2f}  F1={f:.2f}  localised={localised}/{tp if tp else 0} of true positives name an affected flow")
    print()
    print("Recall per bug class:")
    print(table(["class", "detected", "total", "recall"], [[c, v["tp"], v["tp"] + v["fn"], f"{v['tp'] / (v['tp'] + v['fn']):.2f}"] for c, v in sorted(per_class.items())]))
    print()
    print("Recall per expected-detection tier:")
    print(table(["tier", "detected", "total", "recall"], [[t, v["tp"], v["tp"] + v["fn"], f"{v['tp'] / (v['tp'] + v['fn']):.2f}"] for t, v in sorted(per_tier.items())]))
    print()
    print("Per device (bug counted for a device when the manifest lists it; FP = broken observations on control PRs):")
    dev_rows = []
    for d, v in sorted(per_device.items()):
        dp, dr, df = prf(v["tp"], v["fp"], v["fn"])
        dev_rows.append([d, v["tp"], v["tp"] + v["fn"], v["fp"], f"{dp:.2f}", f"{dr:.2f}", f"{df:.2f}"])
    print(table(["device", "detected", "expected", "FP obs", "precision", "recall", "F1"], dev_rows))
    if missing:
        print(f"\nPRs missing from the report (counted as not flagged): {len(missing)}")
        for m in missing:
            print(f"  - {m}")

    if a.json:
        Path(a.json).write_text(json.dumps({
            "tester": report.get("tester"), "overall": {"tp": tp, "fn": fn, "fp": fp, "tn": tn, "precision": p, "recall": r, "f1": f, "localised": localised},
            "per_class": per_class, "per_tier": per_tier, "per_device": per_device, "per_pr": per_pr, "missing": missing,
        }, indent=2))
        print(f"\nwrote {a.json}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
