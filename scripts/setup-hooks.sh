#!/bin/sh
# Cài git hooks cho project. Chạy một lần sau khi clone repo.
# Usage: sh application/scripts/setup-hooks.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
SCRIPTS_DIR="$REPO_ROOT/application/scripts"

mkdir -p "$HOOKS_DIR"

# pre-commit: chạy full CI trước mỗi commit
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/sh
REPO_ROOT="$(git rev-parse --show-toplevel)"
exec "$REPO_ROOT/application/scripts/ci-check.sh"
EOF

chmod +x "$HOOKS_DIR/pre-commit"

echo "✓ Đã cài pre-commit hook → application/scripts/ci-check.sh"
echo "  Mỗi lần commit sẽ chạy: lint + typecheck + build"
