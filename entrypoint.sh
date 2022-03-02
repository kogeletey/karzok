#!/bin/sh

while true
do
    zola build -u $BASE_URL || exit 1
    cp -r public /usr/share/nginx/html
	sleep 300
done
