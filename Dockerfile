FROM alpine:edge

COPY . /www

RUN apk update

RUN apk add --no-cache \
--repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ \
zola \
rsync \
npm

WORKDIR /www

RUN npm ci
RUN npm run link && npm run compile:js

RUN mkdir -p themes/karzok
RUN rsync -va static sass templates config.toml theme.toml themes/karzok

RUN npm run clean

RUN find . -not -name "build.sh" -and -not -depth -path './themes/*' -print -delete

RUN apk del rsync npm
