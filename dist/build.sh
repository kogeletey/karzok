#!/usr/bin/env sh

DIRECTORY="content templates static sass"
FILE="config.toml"

for i in "${DIRECTORY}"; do
  if [[ -d "$i" ]] || [[ -f "$FILE" ]]; then
     echo $i
     cp -rf $i $FILE /www
  fi
done

if [ $1 ]; then
  cd /www
  npm run build -- -u $1
else
  cd /www
  npm run build
fi
