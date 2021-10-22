# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0](https://github.com/blacha/diablo2/compare/v0.8.0...v0.9.0) (2021-10-22)


### Features

* **map:** add isGoodExit for common exits which are important ([2925ed3](https://github.com/blacha/diablo2/commit/2925ed323f0d274ef909e4f91ebf1ff65c68bd0a))





# [0.8.0](https://github.com/blacha/diablo2/compare/v0.7.0...v0.8.0) (2021-10-17)


### Features

* **map:** render super uniques and names on the map ([9cb2c09](https://github.com/blacha/diablo2/commit/9cb2c09c6de9693d0ae5aa2d97a9dd8aef1f069f))
* split map into map server and map viewer ([#186](https://github.com/blacha/diablo2/issues/186)) ([b92efb9](https://github.com/blacha/diablo2/commit/b92efb9c012527fc4d9b36eb286dadcbc52f0be9))


### BREAKING CHANGES

* this splits the map viewer out into @diablo2/viewer and moves a lot of types around





# [0.7.0](https://github.com/blacha/diablo2/compare/v0.6.0...v0.7.0) (2021-10-16)


### Bug Fixes

* **data:** super unique ids are not quite right ([8b71cb0](https://github.com/blacha/diablo2/commit/8b71cb0baaf902d162fc6342761f70f97a1baa5f))


### Features

* **map:** expose the location of super uniques ([93f1ea9](https://github.com/blacha/diablo2/commit/93f1ea96d4b8e1f312d518bc1f554d8162ef533b))
* **map:** load object/exit/level names from mpq and add to map ([#185](https://github.com/blacha/diablo2/issues/185)) ([5510753](https://github.com/blacha/diablo2/commit/5510753d0f67fc78a534a4f67784c420fcd5a2a6))





# [0.6.0](https://github.com/blacha/diablo2/compare/v0.5.0...v0.6.0) (2021-10-13)


### Features

* **data:** add more known attributes ([a7217ff](https://github.com/blacha/diablo2/commit/a7217fff703861b5c9b0867c14690c739048fdf8))
* find map seed from a player name ([#124](https://github.com/blacha/diablo2/issues/124)) ([4763715](https://github.com/blacha/diablo2/commit/476371515e874024bbab730d65dd5319157c07b6))





# [0.5.0](https://github.com/blacha/diablo2/compare/v0.4.0...v0.5.0) (2021-03-26)


### Features

* **data:** expose toHex function ([86e6dbd](https://github.com/blacha/diablo2/commit/86e6dbd7147280c25a6150c4d311c83c1199c3d4))
* add NpcEnchants to track modifiers to Npcs ([9c602c4](https://github.com/blacha/diablo2/commit/9c602c4dbc8973a5c65dd6659b1f46c44f640da0))
* **core:** basic game state from packets flowing though it ([#10](https://github.com/blacha/diablo2/issues/10)) ([c052059](https://github.com/blacha/diablo2/commit/c052059bbe2a62957cbfd877016fdabc1affe13c))





# [0.4.0](https://github.com/blacha/diablo2/compare/v0.3.0...v0.4.0) (2020-11-06)


### Features

* support project diablo2 ([f794865](https://github.com/blacha/diablo2/commit/f79486559a6e0c9a5bb37607d0361fe873500f2c))





# [0.3.0](https://github.com/blacha/diablo2/compare/v0.2.1...v0.3.0) (2020-09-20)

**Note:** Version bump only for package @diablo2/data





## [0.2.1](https://github.com/blacha/diablo2/compare/v0.2.0...v0.2.1) (2020-09-19)

**Note:** Version bump only for package @diablo2/data





# [0.2.0](https://github.com/blacha/diablo2/compare/v0.1.0...v0.2.0) (2020-09-19)

**Note:** Version bump only for package @diablo2/data





# 0.1.0 (2020-09-14)


### Features

* correctly load lang and parse npcs ([9a82945](https://github.com/blacha/diablo2/commit/9a8294541b0b778449cbf811bed82bae1078379f))
* initial commit ([4e1a573](https://github.com/blacha/diablo2/commit/4e1a573675ebb619b8e3a469b2ae398928cbc25f))
* load lang files from tbl to parse items ([29eca9a](https://github.com/blacha/diablo2/commit/29eca9a8226b7f3f8155df628bd7772d5e98e48a))
* more packet parsing ([dcc75b8](https://github.com/blacha/diablo2/commit/dcc75b8b9b0d2eaa18f6763a512f39984e12b327))
* parse npcs from packets using mpq data ([2fa03e2](https://github.com/blacha/diablo2/commit/2fa03e23ddc449e4a19ac687d13dc51cd31abbea))
* somewhat working packet parser ([be51126](https://github.com/blacha/diablo2/commit/be511266d7920f234c22bfb1a933a14d1c66b7bc))
