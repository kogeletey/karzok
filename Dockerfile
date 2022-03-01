FROM alpine:latest AS zola

COPY . /www

ENV BASE_URL .

RUN apk update

RUN apk add \
zola --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ \
rsync \
npm

WORKDIR /www

RUN npm ci
RUN npm run gen

ENV PORT 80

FROM nginx:stable-alpine

ENV BASE_URL .

COPY --from=zola /www/public /usr/share/nginx/html

COPY entrypoint.sh /publish/entrypoint.sh

HEALTHCHECK --interval=1m --timeout=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/ || exit 1

RUN apk add zola

WORKDIR /publish

EXPOSE ${PORT}
VOLUME [ "/www/drafts" ]

ENTRYPOINT [ "/bin/sh" , "/publish/entrypoint.sh" ]

