# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/blacha/diablo2/compare/v0.5.0...v0.6.0) (2021-10-13)


### Bug Fixes

* **map:** die if offsets cannot be defined ([ab61cfd](https://github.com/blacha/diablo2/commit/ab61cfdb377a72cba06978bafe87dab55a2730c4))
* **map:** force a flush after log lines are printed ([9c9a662](https://github.com/blacha/diablo2/commit/9c9a662b5ebebeaad3b457567aaea50969d0b08f))
* **map:** increase timeout to 30seconds for map generation ([5053d46](https://github.com/blacha/diablo2/commit/5053d46a717690dbebd5af69d49fdbe876a3f18d))


### Features

* find map seed from a player name ([#124](https://github.com/blacha/diablo2/issues/124)) ([4763715](https://github.com/blacha/diablo2/commit/476371515e874024bbab730d65dd5319157c07b6))
* **map:** add some debug timings into log generation ([3976008](https://github.com/blacha/diablo2/commit/397600879555799ebd0fd1fe277f29db57371c76))
* **map:** include git commit and hash in cli ([#159](https://github.com/blacha/diablo2/issues/159)) ([04ac188](https://github.com/blacha/diablo2/commit/04ac188a816f44ae5e45f407ec12d9249839016a))
* **map:** serve the index.html/js from the container ([0b0751c](https://github.com/blacha/diablo2/commit/0b0751cb91bcc5f20d3ed3c525b1baed72211628))
* **map:** show exits and waypoints on the map ([#157](https://github.com/blacha/diablo2/issues/157)) ([a0d335f](https://github.com/blacha/diablo2/commit/a0d335f1640c99c04222ab891c668413c50e17b9))
* **map:** support diablo2 client v1.13c ([#158](https://github.com/blacha/diablo2/issues/158)) ([2b248d9](https://github.com/blacha/diablo2/commit/2b248d93aaa867799c287bfdfc6aefbbc7245833))
* **map:** support generating just a single act's data ([24d69ba](https://github.com/blacha/diablo2/commit/24d69ba941b18e69494fa4c46d739c211a773201))





# [0.5.0](https://github.com/blacha/diablo2/compare/v0.4.0...v0.5.0) (2021-03-26)


### Bug Fixes

* **map:** skip mapid 150 on pd2 as it doesnt seem to work yet ([a268073](https://github.com/blacha/diablo2/commit/a2680739a8615e01f7562c25a52d35155cb56393))


### Features

* **core:** basic game state from packets flowing though it ([#10](https://github.com/blacha/diablo2/issues/10)) ([c052059](https://github.com/blacha/diablo2/commit/c052059bbe2a62957cbfd877016fdabc1affe13c))





# [0.4.0](https://github.com/blacha/diablo2/compare/v0.3.0...v0.4.0) (2020-11-06)


### Features

* support both pod and pd2 ([d89f86e](https://github.com/blacha/diablo2/commit/d89f86ed5cd5ce1966ad71f8d10c55f4b09e2add))
* support project diablo2 ([f794865](https://github.com/blacha/diablo2/commit/f79486559a6e0c9a5bb37607d0361fe873500f2c))
* **map:** cache map generations in memory ([24f1bdd](https://github.com/blacha/diablo2/commit/24f1bdd0db415b9246aa9f85b4f16b0e5e045d98))





# [0.3.0](https://github.com/blacha/diablo2/compare/v0.2.1...v0.3.0) (2020-09-20)

**Note:** Version bump only for package @diablo2/map





## [0.2.1](https://github.com/blacha/diablo2/compare/v0.2.0...v0.2.1) (2020-09-19)

**Note:** Version bump only for package @diablo2/map





# [0.2.0](https://github.com/blacha/diablo2/compare/v0.1.0...v0.2.0) (2020-09-19)

**Note:** Version bump only for package @diablo2/map





# 0.1.0 (2020-09-14)


### Bug Fixes

* **map:** allow both Normal.json and 0.json for difficulty ([9835262](https://github.com/blacha/diablo2/commit/98352622ed81b180b63ed150791d73762d98854a))


### Features

* **map:** docker container to render collision maps for most d2 maps ([#1](https://github.com/blacha/diablo2/issues/1)) ([93b09b1](https://github.com/blacha/diablo2/commit/93b09b13df18bd6211a09a9af62ce6c051f9c9e2))
