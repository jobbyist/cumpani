#!/usr/bin/env bash
# Prepare reels: full clips (private bucket 'reels') and baked-blur previews (public bucket 'reels-preview').
# Usage: prepare-reels.sh <in1.mp4> [in2.mp4 ...]  (outputs to ./reels-out, which is git-ignored)
set -euo pipefail
out="${REELS_OUT:-./reels-out}"
mkdir -p "$out"
i=0
for src in "$@"; do
  i=$((i+1))
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$src")
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$src")
  has_audio=$(ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "$src" | head -1)
  # Portrait: fill 540x960. Landscape: fit on a blurred copy of itself (Instagram-style letterbox).
  if [ "$w" -gt "$h" ]; then
    vf="[0:v]split[a][b];[a]scale=540:960:force_original_aspect_ratio=increase,crop=540:960,gblur=sigma=30[bg];[b]scale=540:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,format=yuv420p[v]"
  else
    vf="[0:v]scale=540:960:force_original_aspect_ratio=increase,crop=540:960,format=yuv420p[v]"
  fi
  audio=(-an); [ -n "$has_audio" ] && audio=(-map 0:a:0 -c:a aac -b:a 96k)
  ffmpeg -v error -y -t 30 -i "$src" -filter_complex "$vf" -map "[v]" "${audio[@]}" \
    -c:v libx264 -preset slow -crf 29 -movflags +faststart "$out/reel$i.mp4"
  # Preview: baked blur (obscures detail, motion stays visible), no audio, max 10s.
  ffmpeg -v error -y -t 10 -i "$out/reel$i.mp4" -an \
    -vf "scale=270:480,gblur=sigma=14,scale=540:960" -c:v libx264 -preset slow -crf 32 -pix_fmt yuv420p -movflags +faststart "$out/reel$i-preview.mp4"
done
ls -lh "$out"
