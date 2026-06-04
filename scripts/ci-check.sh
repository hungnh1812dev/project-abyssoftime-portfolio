#!/bin/sh
# Replicates GitHub CI pipeline: lint → typecheck → build
# Usage:
#   ./scripts/ci-check.sh           # full CI (lint + tsc + build)
#   ./scripts/ci-check.sh --quick   # quick check (lint + tsc only, no build)

set -e

# Load nvm so node/bun binaries are available in non-interactive shells (git hooks)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

QUICK=0
[ "$1" = "--quick" ] && QUICK=1

PASS=0
FAIL=0

# Block commits containing hardcoded macOS home directory paths
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true)
if [ -n "$STAGED_FILES" ]; then
  FOUND=$(echo "$STAGED_FILES" | xargs grep -lE '/Users/[a-zA-Z0-9._-]+/' 2>/dev/null || true)
  if [ -n "$FOUND" ]; then
    echo "✗ Commit blocked: hardcoded absolute home path found in staged files:"
    echo "$STAGED_FILES" | xargs grep -nE '/Users/[a-zA-Z0-9._-]+/' 2>/dev/null | head -20
    exit 1
  fi
fi

run_step() {
  label="$1"
  shift
  echo "▶ $label"
  if "$@" 2>&1; then
    echo "✓ $label passed"
    PASS=$((PASS + 1))
  else
    echo "✗ $label FAILED"
    FAIL=$((FAIL + 1))
    return 1
  fi
  echo ""
}

run_step "Lint"       bun run lint
run_step "Type check" bunx tsc --noEmit

if [ "$QUICK" -eq 0 ]; then
  run_step "Build" node node_modules/.bin/next build
fi

echo ""
if [ "$FAIL" -gt 0 ]; then
  echo "✗ $FAIL step(s) failed — commit blocked"
  exit 1
else
  steps=$((QUICK == 0 ? 3 : 2))
  echo "✓ All $steps checks passed"
fi
