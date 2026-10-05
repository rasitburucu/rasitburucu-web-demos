#!/bin/bash
# Final renders, one Blender process per scene (never the open session).
B=/d/SteamLibrary/steamapps/common/Blender/blender.exe
cd "$(dirname "$0")"
for m in ${@:-cayir cayir2 ambar ambar2 avlu avlu2 iskele iskele2}; do
  s=$(date +%s)
  SB_SAVE_BLEND=1 "$B" -b --factory-startup -P sazbahce_scene.py -- $m "$PWD/render/$m.png" 384 100 > "render/$m.log" 2>&1
  echo "$m $(( $(date +%s) - s ))s $(grep -c Error render/$m.log) errors"
done
