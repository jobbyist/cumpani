#!/usr/bin/env bash
# Compress a source video for the members-only hero. Output is NOT committed to git:
# upload hero.mp4 / hero.webm to the private Supabase bucket 'hero' (see docs/hero-video.md).
set -euo pipefail
src="${1:?usage: prepare-hero-video.sh <input.mp4> [out-dir]}"
out="${2:-./hero-out}"
mkdir -p "$out"
ffmpeg -v error -y -i "$src" -an -vf "scale=720:1280" -c:v libx264 -preset slow -crf 29 -pix_fmt yuv420p -movflags +faststart "$out/hero.mp4"
ffmpeg -v error -y -i "$src" -an -vf "scale=720:1280" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 "$out/hero.webm"
ls -lh "$out"
