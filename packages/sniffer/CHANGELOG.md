# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/blacha/diablo2/compare/v0.3.0...v0.4.0) (2020-11-06)


### Features

* support both pod and pd2 ([d89f86e](https://github.com/blacha/diablo2/commit/d89f86ed5cd5ce1966ad71f8d10c55f4b09e2add))
* support project diablo2 ([f794865](https://github.com/blacha/diablo2/commit/f79486559a6e0c9a5bb37607d0361fe873500f2c))





# [0.3.0](https://github.com/blacha/diablo2/compare/v0.2.1...v0.3.0) (2020-09-20)

**Note:** Version bump only for package @diablo2/sniffer





## [0.2.1](https://github.com/blacha/diablo2/compare/v0.2.0...v0.2.1) (2020-09-19)

**Note:** Version bump only for package @diablo2/sniffer





# [0.2.0](https://github.com/blacha/diablo2/compare/v0.1.0...v0.2.0) (2020-09-19)


### Features

* **mpq:** mpq reader that can extract files from patch_d2.mpq ([#2](https://github.com/blacha/diablo2/issues/2)) ([e4ee39b](https://github.com/blacha/diablo2/commit/e4ee39bd63bd3f6f29c8df4de01aaa9970df234d))
* **sniffer:** allow the sniffer to be init without capturing packets ([20507e8](https://github.com/blacha/diablo2/commit/20507e82d7f0cecb3fc4ee12ad36d2a66af5e0f0))





# 0.1.0 (2020-09-14)


### Bug Fixes

* **sniffer:** dont automatically dump alll packets ([5a24c61](https://github.com/blacha/diablo2/commit/5a24c6127abaf3be00473604f494e16f4c881a5a))


### Features

* **map:** docker container to render collision maps for most d2 maps ([#1](https://github.com/blacha/diablo2/issues/1)) ([93b09b1](https://github.com/blacha/diablo2/commit/93b09b13df18bd6211a09a9af62ce6c051f9c9e2))
* adding client packets ([2cdf7e3](https://github.com/blacha/diablo2/commit/2cdf7e3e4c13471fcad75f2c31cd008c2ec9c286))
* correctly load lang and parse npcs ([9a82945](https://github.com/blacha/diablo2/commit/9a8294541b0b778449cbf811bed82bae1078379f))
* load lang files from tbl to parse items ([29eca9a](https://github.com/blacha/diablo2/commit/29eca9a8226b7f3f8155df628bd7772d5e98e48a))
* parse npcs from packets using mpq data ([2fa03e2](https://github.com/blacha/diablo2/commit/2fa03e23ddc449e4a19ac687d13dc51cd31abbea))
* start loading mpq data in to be read by the packet parser ([5745736](https://github.com/blacha/diablo2/commit/5745736b03fa0978a0b0eb420527925fbb3ef1de))
* start parsing monster information ([8a66db3](https://github.com/blacha/diablo2/commit/8a66db3c91f0686d41c73827ca31c493a5fc4c77))
