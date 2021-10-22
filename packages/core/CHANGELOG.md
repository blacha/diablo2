# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0](https://github.com/blacha/diablo2/compare/v0.8.0...v0.9.0) (2021-10-22)

**Note:** Version bump only for package @diablo2/core





# [0.8.0](https://github.com/blacha/diablo2/compare/v0.7.0...v0.8.0) (2021-10-17)

**Note:** Version bump only for package @diablo2/core





# [0.7.0](https://github.com/blacha/diablo2/compare/v0.6.0...v0.7.0) (2021-10-16)

**Note:** Version bump only for package @diablo2/core





# [0.6.0](https://github.com/blacha/diablo2/compare/v0.5.0...v0.6.0) (2021-10-13)


### Features

* find map seed from a player name ([#124](https://github.com/blacha/diablo2/issues/124)) ([4763715](https://github.com/blacha/diablo2/commit/476371515e874024bbab730d65dd5319157c07b6))





# [0.5.0](https://github.com/blacha/diablo2/compare/v0.4.0...v0.5.0) (2021-03-26)


### Bug Fixes

* expose npc enchants out of game state ([2a933c2](https://github.com/blacha/diablo2/commit/2a933c2fae9eae13272c2e115f0a444116c88f98))
* **core:** skip packet 0x2b as we cannot parse it right now ([4eb2001](https://github.com/blacha/diablo2/commit/4eb2001e291aef70a27842cd1d60c1da19268503))


### Features

* **core:** basic game state from packets flowing though it ([#10](https://github.com/blacha/diablo2/issues/10)) ([c052059](https://github.com/blacha/diablo2/commit/c052059bbe2a62957cbfd877016fdabc1affe13c))
* **core:** easier debugging of packet parse failures ([3958f68](https://github.com/blacha/diablo2/commit/3958f68dda26be71163ba97054232ad9a9efe455))
* **core:** expand on game state tracking ([7e6dcc7](https://github.com/blacha/diablo2/commit/7e6dcc77d801e919ddfcd6cb6c3077a1f6dd8073))
* **core:** filter out old objects if they havent been seen in a while ([2a01ea6](https://github.com/blacha/diablo2/commit/2a01ea66eb33d785de8c4332ba690e2c29c5e5fe))
* **core:** improve xp tracking ([6a1e757](https://github.com/blacha/diablo2/commit/6a1e757f4c5e03fbce0ef658ff27813f680eb215))
* **core:** track when monsters die ([6309f29](https://github.com/blacha/diablo2/commit/6309f292446d0d5cd4ba015c7d8d91ad44356398))
* **core:** track when packets are not parsed correctly ([0ed0975](https://github.com/blacha/diablo2/commit/0ed0975b8d56be24d8db4e18942bc4692505e7f8))





# [0.4.0](https://github.com/blacha/diablo2/compare/v0.3.0...v0.4.0) (2020-11-06)


### Features

* support both pod and pd2 ([d89f86e](https://github.com/blacha/diablo2/commit/d89f86ed5cd5ce1966ad71f8d10c55f4b09e2add))
* support project diablo2 ([f794865](https://github.com/blacha/diablo2/commit/f79486559a6e0c9a5bb37607d0361fe873500f2c))





# [0.3.0](https://github.com/blacha/diablo2/compare/v0.2.1...v0.3.0) (2020-09-20)

**Note:** Version bump only for package @diablo2/core





## [0.2.1](https://github.com/blacha/diablo2/compare/v0.2.0...v0.2.1) (2020-09-19)

**Note:** Version bump only for package @diablo2/core





# [0.2.0](https://github.com/blacha/diablo2/compare/v0.1.0...v0.2.0) (2020-09-19)

**Note:** Version bump only for package @diablo2/core





# 0.1.0 (2020-09-14)


### Features

* adding client packets ([2cdf7e3](https://github.com/blacha/diablo2/commit/2cdf7e3e4c13471fcad75f2c31cd008c2ec9c286))
* correctly load lang and parse npcs ([9a82945](https://github.com/blacha/diablo2/commit/9a8294541b0b778449cbf811bed82bae1078379f))
* initial commit ([4e1a573](https://github.com/blacha/diablo2/commit/4e1a573675ebb619b8e3a469b2ae398928cbc25f))
* initial work on binary file parser ([4f16516](https://github.com/blacha/diablo2/commit/4f165169f7294f51a2930690428b18aa1d42fae8))
* load lang files from tbl to parse items ([29eca9a](https://github.com/blacha/diablo2/commit/29eca9a8226b7f3f8155df628bd7772d5e98e48a))
* more packet parsing ([dcc75b8](https://github.com/blacha/diablo2/commit/dcc75b8b9b0d2eaa18f6763a512f39984e12b327))
* parse npcs from packets using mpq data ([2fa03e2](https://github.com/blacha/diablo2/commit/2fa03e23ddc449e4a19ac687d13dc51cd31abbea))
* somewhat working packet parser ([be51126](https://github.com/blacha/diablo2/commit/be511266d7920f234c22bfb1a933a14d1c66b7bc))
* start loading mpq data in to be read by the packet parser ([5745736](https://github.com/blacha/diablo2/commit/5745736b03fa0978a0b0eb420527925fbb3ef1de))
* start parsing monster information ([8a66db3](https://github.com/blacha/diablo2/commit/8a66db3c91f0686d41c73827ca31c493a5fc4c77))
