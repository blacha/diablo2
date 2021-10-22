# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0](https://github.com/blacha/diablo2/compare/v0.8.0...v0.9.0) (2021-10-22)

**Note:** Version bump only for package @diablo2/packets





# [0.8.0](https://github.com/blacha/diablo2/compare/v0.7.0...v0.8.0) (2021-10-17)

**Note:** Version bump only for package @diablo2/packets





# [0.7.0](https://github.com/blacha/diablo2/compare/v0.6.0...v0.7.0) (2021-10-16)


### Features

* **map:** load object/exit/level names from mpq and add to map ([#185](https://github.com/blacha/diablo2/issues/185)) ([5510753](https://github.com/blacha/diablo2/commit/5510753d0f67fc78a534a4f67784c420fcd5a2a6))





# [0.6.0](https://github.com/blacha/diablo2/compare/v0.5.0...v0.6.0) (2021-10-13)


### Features

* find map seed from a player name ([#124](https://github.com/blacha/diablo2/issues/124)) ([4763715](https://github.com/blacha/diablo2/commit/476371515e874024bbab730d65dd5319157c07b6))





# [0.5.0](https://github.com/blacha/diablo2/compare/v0.4.0...v0.5.0) (2021-03-26)


### Bug Fixes

* **packets:** actually export all the packets ([bc7b6c2](https://github.com/blacha/diablo2/commit/bc7b6c22d60413b9e3d27a9b9aeada341d90011e))
* **packets/pd2:** correct parsing of packet 0x56 ([459ef8a](https://github.com/blacha/diablo2/commit/459ef8a7181a08ebf0cb76ea778a4703240a3554))


### Features

* add NpcEnchants to track modifiers to Npcs ([9c602c4](https://github.com/blacha/diablo2/commit/9c602c4dbc8973a5c65dd6659b1f46c44f640da0))
* **core:** basic game state from packets flowing though it ([#10](https://github.com/blacha/diablo2/issues/10)) ([c052059](https://github.com/blacha/diablo2/commit/c052059bbe2a62957cbfd877016fdabc1affe13c))
* **packets:** support unknown 0x56 packet for pd2 ([33b25de](https://github.com/blacha/diablo2/commit/33b25dea35335f046730ba5778466ed79da4a041))





# [0.4.0](https://github.com/blacha/diablo2/compare/v0.3.0...v0.4.0) (2020-11-06)


### Features

* support both pod and pd2 ([d89f86e](https://github.com/blacha/diablo2/commit/d89f86ed5cd5ce1966ad71f8d10c55f4b09e2add))
* support project diablo2 ([f794865](https://github.com/blacha/diablo2/commit/f79486559a6e0c9a5bb37607d0361fe873500f2c))
* **packets:** add missing 0xaa StateAdd packet ([c31f565](https://github.com/blacha/diablo2/commit/c31f5657f6510a8ac2f58170a7984b98a3e002dc))





# [0.3.0](https://github.com/blacha/diablo2/compare/v0.2.1...v0.3.0) (2020-09-20)

**Note:** Version bump only for package @diablo2/packets





## [0.2.1](https://github.com/blacha/diablo2/compare/v0.2.0...v0.2.1) (2020-09-19)

**Note:** Version bump only for package @diablo2/packets





# [0.2.0](https://github.com/blacha/diablo2/compare/v0.1.0...v0.2.0) (2020-09-19)


### Bug Fixes

* **packets:** correct typings for binary parser for npc/item packets ([9665ee6](https://github.com/blacha/diablo2/commit/9665ee6945e9b5cf590af3ae8d6e74b58aabe800))
* **packets:** dont error if we do not know the attribute name ([14a3bbd](https://github.com/blacha/diablo2/commit/14a3bbd2871c5187a362681e78b11cceac847361))


### Features

* **mpq:** mpq reader that can extract files from patch_d2.mpq ([#2](https://github.com/blacha/diablo2/issues/2)) ([e4ee39b](https://github.com/blacha/diablo2/commit/e4ee39bd63bd3f6f29c8df4de01aaa9970df234d))





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
* start parsing monster information ([8a66db3](https://github.com/blacha/diablo2/commit/8a66db3c91f0686d41c73827ca31c493a5fc4c77))
