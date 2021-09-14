+++
title = "Install"
weight = 1
+++
# Dependencies

1. [Zola](https://www.getzola.org/documentation/getting-started/installation/)
2. [Node.js](https://nodejs.org/)

install for your platform.

## Optional

1. [yj](https://github.com/sclevine/yj)
    > for transfer toml file in yaml
2. [docker](https://docs.docker.com/engine/install/)
    > for packaging container
3. [rsync](https://rsync.samba.org/)
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

See more in [Karzok Configuration](#configuration)

## 4. Added new content

```zsh
    cp ./themes/content/_index.md content/_index.md
    cp ./thems/content/tmpl.md content/filename.md
```

how you can give freedom to your creativity

## 5. Run the project

### With [docker-compose](https://docs.docker.com/compose) and [cargo make](https://sagiegurari.github.io/cargo-make/)

```zsh
cargo make --makefile make.toml dockerup
```

### Without

i. development enviroment

1. Install node dependencies needed to work

```zsh
npm run gen # don't use npm install before that
```

2. Just run `zola serve` in the root path of the project

```zsh
zola serve
```

Open in favorite browser [http://127.0.0.1:1111](http://127.0.0.1:1111). Saved
changes live reolad.

ii. production enviroment

-   with docker

1. Build docker image

```zsh
docker build .
```

or if installed docker-compose

```zsh
docker-compose build
```

2. Run containers

```zsh
docker start -d -p 80:80 container_id
```

or if installed docker-compose

```zsh
docker-compose up -d
```

Open in favorite browser [https://localhost](http://localhost)


