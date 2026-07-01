#!/usr/bin/env bash
# Create a new article from the template.
# Usage: ./scripts/new-article.sh my-slug "My Article Title"

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SLUG="${1:-}"
TITLE="${2:-}"

if [[ -z "$SLUG" ]]; then
  echo "Usage: ./scripts/new-article.sh <slug> [title]"
  echo "Example: ./scripts/new-article.sh my-post \"My Post Title\""
  exit 1
fi

MD="$ROOT/articles/${SLUG}.md"
HTML="$ROOT/${SLUG}.html"
MANIFEST="$ROOT/articles/manifest.json"

if [[ -f "$MD" ]]; then
  echo "Error: $MD already exists"
  exit 1
fi

cp "$ROOT/articles/_template.md" "$MD"

if [[ -n "$TITLE" ]]; then
  if [[ "$OSTYPE" == darwin* ]]; then
    sed -i '' "s/Your Article Title Here/${TITLE}/" "$MD"
  else
    sed -i "s/Your Article Title Here/${TITLE}/" "$MD"
  fi
fi

cp "$ROOT/article.template.html" "$HTML"
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' "s/SLUG/${SLUG}/g" "$HTML"
  if [[ -n "$TITLE" ]]; then
    sed -i '' "s/TITLE/${TITLE}/g" "$HTML"
  fi
else
  sed -i "s/SLUG/${SLUG}/g" "$HTML"
  if [[ -n "$TITLE" ]]; then
    sed -i "s/TITLE/${TITLE}/g" "$HTML"
  fi
fi

python3 <<PY
import json
from pathlib import Path

manifest_path = Path("$MANIFEST")
data = json.loads(manifest_path.read_text())
filename = "${SLUG}.md"
if filename not in data["articles"]:
    data["articles"].insert(0, filename)
    manifest_path.write_text(json.dumps(data, indent=2) + "\n")
PY

echo "Created:"
echo "  $MD"
echo "  $HTML"
echo "  Updated $MANIFEST"
echo ""
echo "Next: edit the markdown, set date/excerpt/tags, then commit."
