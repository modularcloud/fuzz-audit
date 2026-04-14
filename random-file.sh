#!/usr/bin/env bash
set -euo pipefail

dir="${1:-.}"

files=()
while IFS= read -r f; do
  files+=("$f")
done < <(git -C "$dir" ls-files --cached --others --exclude-standard | sed "s|^|$dir/|")

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No files found in $dir" >&2
  exit 1
fi

index=$((RANDOM % ${#files[@]}))
echo "${files[$index]}"
