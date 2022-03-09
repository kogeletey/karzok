FROM alpine:latest AS zola

COPY . /www

ENV BASE_URL localhost

RUN apk update

RUN apk add \
zola --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ \
rsync \
npm

WORKDIR /www

RUN npm ci
RUN npm run gen

FROM nginx:stable-alpine

ENV PORT 80

ENV BASE_URL localhost

COPY --from=zola /www/public /usr/share/nginx/html


COPY entrypoint.sh /publish/entrypoint.sh
COPY --from=zola /www/templates /publish/templates
COPY --from=zola /www/sass /publish/sass

HEALTHCHECK --interval=1m --timeout=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/ || exit 1

RUN apk add zola

WORKDIR /publish

EXPOSE ${PORT}

VOLUME [ "/publish/content","/publish/config.toml"]

ENTRYPOINT [ "/bin/sh" , "/publish/entrypoint.sh" ]
