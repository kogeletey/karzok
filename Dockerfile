FROM alpine:edge

COPY . /www

ENV BASE_URL localhost

RUN apk update

RUN apk add --no-cache \
zola --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ \
rsync \
npm

WORKDIR /www

RUN npm ci
RUN npm run gen

RUN npm run clean

RUN apk del rsync npm
