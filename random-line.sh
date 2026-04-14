#!/usr/bin/env bash
set -euo pipefail

file="${1:?Usage: random-line.sh <file>}"

lines=()
while IFS= read -r line; do
  lines+=("$line")
done < "$file"

if [[ ${#lines[@]} -eq 0 ]]; then
  echo "No lines found in $file" >&2
  exit 1
fi

index=$((RANDOM % ${#lines[@]}))
echo "$((index + 1)):${lines[$index]}"
