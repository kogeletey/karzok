#!/usr/bin/env sh

if [ $1 ]; then
  zola build -u $1
else
  zola build
fi



