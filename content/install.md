+++
title = "Install"
weight = 1
+++

# Dependencies

1. [Zola](https://www.getzola.org/documentation/getting-started/installation/)
2. [Node.js](https://nodejs.org/)
3. [rsync](https://rsync.samba.org/)

install for your platform.

## Optional

- [docker](https://docs.docker.com/engine/install/)
   > for packaging container
   > A better copy and move

# Get Started

## 1. Create a new zola site

```zsh
zola init zola_site
```

## 2. Download this theme to you themes directory:

```zsh
git clone https://git.sr.ht/~kogeletey/karzok zola_site/theme
```

or install as submodule:

```zsh
cd zola_site
git init # if your project is a git repository already, ignore this command
git submodule add https://git.sr.ht/~kogeletey/karzok zola_site/themes
```

## 3. Configuration. Open in favorite editor `config.toml`

```toml
base_url = "https://karzok.example.net" # set-up for production
theme = "karzok"
```

See more in [Karzok Configuration](/configure)

## 4. Added new content

```zsh
    cp ./themes/content/_index.md content/_index.md
    # a template will appear with which you can quickly start writing
    # cp ./themes/content/tmpl.md content/filename.md
```

how you can give freedom to your creativity

## 5. Run the project

i. development enviroment

1. Install node dependencies needed to work

```zsh
npm ci
npm run gen 
```

2. Just run `zola serve` in the root path of the project

```zsh
zola serve
```

Open in favorite browser [http://127.0.0.1:1111](http://127.0.0.1:1111). Saved
changes live reolad.

ii. production enviroment

- with docker

1. Write file for container

```Dockerfile
FROM ghcr.io/kogeletey/karzok:latest AS build-stage
# or your path to image
ADD . /www
WORKDIR /www
RUN sh /www/build.sh 

FROM nginx:stable-alpine

COPY --from=build-stage /www/public /usr/share/nginx/html

EXPOSE 80
```

2.  Run the your container
```zsh
docker build -t <your_name_image> . &&\
docker run -d -p 8080:8080 <your_name_image> 
```
- using gitlab-ci and gitlab-pages

```yml
image: ghcr.io/kogeletey/karzok:latest # or change use your registry

pages: 
  script:
    - sh /www/build.sh   
    - mv /www/public public
  artifacts:
    paths:
      - public/
```

Open in favorite browser [https://localhost:8080](http://localhost:8080)
