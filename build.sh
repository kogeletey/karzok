#!/usr/bin/env sh

DIRECTORY="content templates static"
FILE="config.toml"

for i in "${DIRECTORY[@]}"; do
  echo $i
  if [[ -d "$i" ]] && [[ -f "$FILE" ]]; then
     cp -rf $i $FILE /www
  fi
done

if [ $1 ]; then
  cd /www
  zola build -u $1
else
  cd /www
  zola build
fi
