FROM alpine:latest AS zola

COPY . /www

RUN apk update

RUN apk add \
zola --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ \
npm \
rsync

WORKDIR /www

RUN npm run gen

FROM nginx:stable-alpine

COPY --from=zola /www/public /usr/share/nginx/html

EXPOSE 80

