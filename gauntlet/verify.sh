#!/usr/bin/env bash
# Proves every seeded regression is real:
#   1. builds main, starts it, runs ALL proofs  -> every proof must PASS
#   2. for each bug branch: builds it in a git worktree, starts it, runs its proof -> proof must FAIL
#      (optionally --baseline: also runs the full baseline suite in tests/ against the branch)
#   3. writes gauntlet/verify-results.json and gauntlet/VERIFY-RESULTS.md
#
# Usage: gauntlet/verify.sh [--only 01,05] [--baseline] [--skip-main]
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${GAUNTLET_PORT:-3100}"
WT_ROOT="${GAUNTLET_WORKTREES:-/tmp/gauntlet-worktrees}"
LOG_DIR="$ROOT/gauntlet/.verify-logs"
ONLY=""; BASELINE=0; SKIP_MAIN=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --only) ONLY="$2"; shift 2 ;;
    --baseline) BASELINE=1; shift ;;
    --skip-main) SKIP_MAIN=1; shift ;;
    *) echo "unknown arg $1"; exit 2 ;;
  esac
done
mkdir -p "$LOG_DIR" "$WT_ROOT"
cd "$ROOT"

export GAUNTLET_BASE_URL="http://localhost:$PORT"
SERVER_PID=""

start_server() { # $1 = dir
  ( cd "$1" && exec node node_modules/next/dist/bin/next start -p "$PORT" ) >"$LOG_DIR/server.log" 2>&1 &
  SERVER_PID=$!
  for _ in $(seq 1 60); do
    curl -sf -o /dev/null "$GAUNTLET_BASE_URL/" && return 0
    sleep 1
  done
  echo "server did not start (see $LOG_DIR/server.log)"; return 1
}
stop_server() {
  [[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null
  pkill -f "next start -p $PORT" 2>/dev/null
  SERVER_PID=""
  sleep 1
}
trap stop_server EXIT

run_proof() { # $1 = spec file, $2 = project, $3 = log name
  npx playwright test -c gauntlet/proofs/playwright.config.ts "$1" --project="$2" --reporter=line >"$LOG_DIR/$3.log" 2>&1
}

# manifest rows: id|branch|spec|project
mapfile -t ROWS < <(python3 - "$ONLY" <<'PY'
import json, sys
only = set(sys.argv[1].split(",")) if sys.argv[1] else None
m = json.load(open("gauntlet/manifest.json"))
for b in m["bugs"]:
    n = b["id"].split("-")[1]
    if only and n not in only: continue
    print("|".join([b["id"], b["branch"], b["proof"]["spec"].split("/")[-1], b["proof"]["project"]]))
PY
)

declare -A MAIN_RESULT BRANCH_BUILD BRANCH_PROOF BASELINE_RESULT

if [[ $SKIP_MAIN -eq 0 ]]; then
  echo "== main: build"
  npm run build >"$LOG_DIR/build-main.log" 2>&1 || { echo "main build failed"; exit 1; }
  start_server "$ROOT" || exit 1
  for row in "${ROWS[@]}"; do
    IFS='|' read -r id branch spec project <<<"$row"
    if run_proof "$spec" "$project" "main-$id"; then MAIN_RESULT[$id]=pass; else MAIN_RESULT[$id]=FAIL; fi
    echo "   main  $id proof: ${MAIN_RESULT[$id]}"
  done
  stop_server
fi

for row in "${ROWS[@]}"; do
  IFS='|' read -r id branch spec project <<<"$row"
  wt="$WT_ROOT/${branch//\//__}"
  echo "== $id ($branch)"
  if [[ ! -d "$wt" ]]; then
    git fetch -q origin "$branch" 2>/dev/null || true
    git worktree add -q "$wt" "$branch" 2>/dev/null || git worktree add -q "$wt" "origin/$branch" || { echo "   cannot check out $branch"; BRANCH_BUILD[$id]=missing; continue; }
  fi
  [[ -e "$wt/node_modules" ]] || ln -s "$ROOT/node_modules" "$wt/node_modules"
  if ( cd "$wt" && npm run build >"$LOG_DIR/build-$id.log" 2>&1 ); then BRANCH_BUILD[$id]=ok; else BRANCH_BUILD[$id]=FAIL; echo "   build FAILED"; continue; fi
  start_server "$wt" || { BRANCH_PROOF[$id]="server-error"; continue; }
  if run_proof "$spec" "$project" "branch-$id"; then BRANCH_PROOF[$id]="PASS (bug not detected!)"; else BRANCH_PROOF[$id]=fails; fi
  echo "   build ok, proof on branch: ${BRANCH_PROOF[$id]}"
  if [[ $BASELINE -eq 1 ]]; then
    BASE_URL="$GAUNTLET_BASE_URL" npx playwright test --reporter=line >"$LOG_DIR/baseline-$id.log" 2>&1
    failed=$(grep -oE "^ +[0-9]+ failed" "$LOG_DIR/baseline-$id.log" | awk '{print $1}')
    BASELINE_RESULT[$id]="${failed:-0}"
    echo "   baseline suite failures: ${BASELINE_RESULT[$id]}"
  fi
  stop_server
done

python3 - "$BASELINE" "$SKIP_MAIN" <<PY
import json, sys, datetime
baseline = sys.argv[1] == "1"; skip_main = sys.argv[2] == "1"
m = json.load(open("gauntlet/manifest.json"))
rows = """$(for row in "${ROWS[@]}"; do IFS='|' read -r id b s p <<<"$row"; echo "$id|${MAIN_RESULT[$id]:-skipped}|${BRANCH_BUILD[$id]:-?}|${BRANCH_PROOF[$id]:-?}|${BASELINE_RESULT[$id]:-}"; done)""".strip().splitlines()
by = {b["id"]: b for b in m["bugs"]}
out = []
for r in rows:
    id, main, build, proof, base = r.split("|")
    b = by[id]
    out.append({"id": id, "branch": b["branch"], "class": b["class"], "project": b["proof"]["project"],
                "proof_on_main": main, "branch_build": build, "proof_on_branch": proof,
                "verified": main in ("pass", "skipped") and build == "ok" and proof == "fails",
                **({"baseline_failures": int(base) if base else None} if baseline else {})})
json.dump({"generated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "results": out}, open("gauntlet/verify-results.json", "w"), indent=2)
ok = sum(1 for o in out if o["verified"])
lines = [f"# verify.sh results", "", f"Generated {out and json.load(open('gauntlet/verify-results.json'))['generated_at']} — {ok}/{len(out)} bugs verified (proof passes on main, branch builds, proof fails on branch).", ""]
hdr = "| Bug | Class | Proof project | Proof on main | Branch build | Proof on branch |" + (" Baseline suite failures on branch |" if baseline else "")
lines += [hdr, "|" + "---|" * (7 if baseline else 6)]
for o in out:
    lines.append(f"| {o['id']} | {o['class']} | {o['project']} | {o['proof_on_main']} | {o['branch_build']} | {o['proof_on_branch']} |" + (f" {o.get('baseline_failures')} |" if baseline else ""))
open("gauntlet/VERIFY-RESULTS.md", "w").write("\n".join(lines) + "\n")
print(f"\n{ok}/{len(out)} verified -> gauntlet/VERIFY-RESULTS.md")
PY
