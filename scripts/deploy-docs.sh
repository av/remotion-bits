#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
DIST_DIR="$DOCS_DIR/dist"

PROJECT_NAME="${1:-${CF_PAGES_PROJECT:-remotion-bits}}"
BRANCH_NAME="${CF_PAGES_BRANCH:-master}"

if [[ ! -d "$DOCS_DIR" ]]; then
  echo "Docs directory not found at $DOCS_DIR" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not found in PATH" >&2
  exit 1
fi

echo "Building docs site..."
npm --prefix "$DOCS_DIR" install
npm --prefix "$DOCS_DIR" run build

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Build output not found at $DIST_DIR" >&2
  exit 1
fi

echo "Deploying to Cloudflare Pages project: $PROJECT_NAME (branch: $BRANCH_NAME)"
npx --yes wrangler pages deploy "$DIST_DIR" --project-name "$PROJECT_NAME" --branch "$BRANCH_NAME"
