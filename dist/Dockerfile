FROM alpine:edge

COPY . /www

RUN apk update

RUN apk add --no-cache \
--repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ \
npm

WORKDIR /www

RUN npm ci
RUN mkdir -p themes/karzok && cp -r static templates theme.toml config.toml themes/karzok

RUN find . -not -name "build.sh" -and -not -depth -path './themes/*' -print -delete
