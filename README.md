# Karzok
![screenshot](./screenshot.png)
## Demo
[Fmatch Karzok](https://fmatch.org/karzok)
A theme for your documentation. Fast and secure
## Requirements

Karzok uses npm,zola to dependency managment,rendering, scripts and plugins.

### Install

1. [Zola](https://www.getzola.org/documentation/getting-started/installation/)
2. [Node.js](https://nodejs.org/)

for your platform.

### Optional

1. [yj](https://github.com/sclevine/yj)
    > for transfer toml file in yaml
2. [docker](https://docs.docker.com/engine/install/)
    > for packaging container
3. [rsync](https://rsync.samba.org/)
    > A better copy and move

## Get Started

### 1. Create a new zola site

```zsh
zola init zola_site
```

### 2. Download this theme to you themes directory:

```zsh
git clone https://git.sr.ht/~kogeletey/karzok zola_site/themes
```

or install as submodule:

```zsh
cd zola_site
git init # if your project is a git repository already, ignore this command
git submodule add https://git.sr.ht/~kogeletey/karzok zola_site/themes
```

### 3. Configuration. Open in favorite editor `config.toml`

```toml
base_url = "https://karzok.example.net" # set-up for production
theme = "karzok"
```

See more in [Karzok Configuration](#configuration)

### 4. Added new content

```zsh
    cp ./themes/content/_index.md content/_index.md
    cp ./thems/content/tmpl.md content/filename.md
```

how you can give freedom to your creativity

### 5. Run the project

#### With [docker-compose](https://docs.docker.com/compose) and [cargo make](https://sagiegurari.github.io/cargo-make/)

```zsh
cargo make --makefile make.toml dockerup
```

#### Without

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

## Configuration

## options under the `[extra]`

1. `math` - rendering math formulas throught [katex](https://katex.org)
2. `favicon` - set path to favicon icon import(default `favicon`)
3. `[[extra.menu]]` - the main navigation on the site
4. `[[extra.header]]` - the header navigantion for the site

### Templates

All pages are extend to the base.html, and you can customize them as need.

## License

This program is Free Software: You can use, study share and improve it at your
will. Specifically you can redistribute and/or modify it under the terms of the
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
# Contribute
Make sure to read the [Code of Conduct](/meta/code-of-conduct)

## Find bugs and come up with features
On the [todo.sr.ht](https://todo.sr.ht/~kogeletey/karzok) or [github issues](https://github.com/kogeletey/karzok/issues)

## Improve Code
The Karzok is stored in the repository at [sr.ht](https://sr.ht/~kogeletey/karzok) and mirror [github](https://github.com/kogeletey/karzok)
### TODOs:
-   [ ] readme contrubutions
-   [x] choose code_of_conduct
-   [x] Proceed subpages
-   [ ] create mobile version
-   [x] Choose license
-   [ ] Adding full path article in the page
-   [ ] Make dark theme
-   [ ] Continue author rendering
-   [ ] Adding word count
-   [x] refactor home.scss

> Thank you so much for any help
