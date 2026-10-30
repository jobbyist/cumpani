#!/usr/bin/env bash
# Generate tiny, heavily blurred JPGs for logged-out visitors. The originals are never shown to them.
set -euo pipefail
src="${1:-public/cumpion-profiles}"
mkdir -p "$src/blur"
for f in "$src"/*.png; do
  n=$(basename "$f" .png)
  ffmpeg -v error -y -i "$f" -vf "scale=30:40,gblur=sigma=2,scale=60:80:flags=bicubic" -q:v 6 "$src/blur/$n.jpg"
done
ls -l "$src/blur" | head -4
