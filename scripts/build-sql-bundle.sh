#!/usr/bin/env bash
# Concatenate every migration into one file to paste into the Supabase SQL editor (run once, in order).
set -euo pipefail
out="supabase/all-migrations.sql"
: > "$out"
for f in $(ls supabase/migrations/*.sql | sort); do
  printf -- '-- ===== %s =====\n' "$(basename "$f")" >> "$out"
  cat "$f" >> "$out"
  printf '\n\n' >> "$out"
done
echo "wrote $out ($(wc -l < "$out") lines)"
