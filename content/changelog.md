+++
title = "Changelog"
weight = 4
+++

# [unreleased]

## New features
- provide zola description by meta tag in html
- new parameter `item.alt` text for your svg icon in header, if it is not specified, then the link to the resource is used as it

## Maintenance
- change license at the MIT

# [0.2.1]

## New features

- added the ability to tear down the sidebar menu

## Maintenance

- switch from sr.ht builds to github workflows 
- setup staging domain
- README.md remove deprecated parameter and karzok configuration adding link
- Rename src to layout folder, and started common styles into individual components.


# [0.2.0] 

## New features

- mobile version is made in early version
- alpha search
- new settings `relative_path` which prints in full page
- new parameter `config.extra.theme_color` which allow tab coloring in safari
- experimental settings `header.container` activate by `devmode`
- new Dockerfile
- setup postcss and swc to compiling

## Bug fixing

- fixed favicons
- fixing toc and sidebar overflow
- fixing article.css large list
- correct minutes word
- fix bug with typo


## Maintenance

- improved normalize.css by @sindresorhus
- separate header parameter to `header_right` and `header_left`
- README.md set link center and add design with penpot
- remove static folder, by it generation
- .build.yml new steps added for compile and optimize css code
- split the css files and reduced the size of the loaded content
- redesigned menu 
- replaces font with inter
- write components a bem methology
- globally set img width
- separate macros file

# [0.1.3] - 2021-09-14

## New features

- settings `show_word_count` and `show_reading_time` allowing you to show the
  number of words and the time of reading it on the page, respectively.
- macro toc now has the opinion `config.extra.children` display all headers,
  nested within each other.
- added the ability to set an icon in the header.
- add possibility disable config.menu
- macros new katex contrib plugins added for rendering shortcodes

## Bug fixing

- macro footer now automatically affixes the version, toc trying to highlight a
  specific header on pages
- macros fixed display, now tags are displayed correctly

# [0.1.2] - 2021-08-28

## New features

- 404 template stylized
- configure the ability to store assets on another cdn.

## Maintenance

- base.html move link to resources for convience from scss file

## Bug fixing

- Sidebar selected in separated files and fix big sidebar error
- Fixed chevron link
- Sidebar width fixing size
- Fixed a bug that manifests itself in the sidebar
- toc fixed width layout error

# [0.1.0] - 2021-08-26

- new zola theme for your documentation, first public release under license
  Apache 2.0
