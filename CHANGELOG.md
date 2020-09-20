# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.3.0](https://github.com/blacha/diablo2/compare/v0.2.1...v0.3.0) (2020-09-20)


### Features

* **bintools:** load data directly from the mpq ([#6](https://github.com/blacha/diablo2/issues/6)) ([d2824f7](https://github.com/blacha/diablo2/commit/d2824f7478a21043de647b733a3cb0532c291cb5))
* **mpq:** allow both / and \ as path separators ([#4](https://github.com/blacha/diablo2/issues/4)) ([c315148](https://github.com/blacha/diablo2/commit/c315148e10f4f89dcc0822e84df57be8f4af5212))
* **mpq:** support encrypted mpq files ([#5](https://github.com/blacha/diablo2/issues/5)) ([45560a1](https://github.com/blacha/diablo2/commit/45560a13e26dc189ac58953c08f5e0176d9c8ede))





## [0.2.1](https://github.com/blacha/diablo2/compare/v0.2.0...v0.2.1) (2020-09-19)

**Note:** Version bump only for package @diablo2/core





# [0.2.0](https://github.com/blacha/diablo2/compare/v0.1.0...v0.2.0) (2020-09-19)


### Bug Fixes

* **packets:** correct typings for binary parser for npc/item packets ([9665ee6](https://github.com/blacha/diablo2/commit/9665ee6945e9b5cf590af3ae8d6e74b58aabe800))
* **packets:** dont error if we do not know the attribute name ([14a3bbd](https://github.com/blacha/diablo2/commit/14a3bbd2871c5187a362681e78b11cceac847361))


### Features

* **mpq:** mpq reader that can extract files from patch_d2.mpq ([#2](https://github.com/blacha/diablo2/issues/2)) ([e4ee39b](https://github.com/blacha/diablo2/commit/e4ee39bd63bd3f6f29c8df4de01aaa9970df234d))
* **sniffer:** allow the sniffer to be init without capturing packets ([20507e8](https://github.com/blacha/diablo2/commit/20507e82d7f0cecb3fc4ee12ad36d2a66af5e0f0))





# 0.1.0 (2020-09-14)


### Bug Fixes

* **map:** allow both Normal.json and 0.json for difficulty ([9835262](https://github.com/blacha/diablo2/commit/98352622ed81b180b63ed150791d73762d98854a))
* **sniffer:** dont automatically dump alll packets ([5a24c61](https://github.com/blacha/diablo2/commit/5a24c6127abaf3be00473604f494e16f4c881a5a))


### Features

* **map:** docker container to render collision maps for most d2 maps ([#1](https://github.com/blacha/diablo2/issues/1)) ([93b09b1](https://github.com/blacha/diablo2/commit/93b09b13df18bd6211a09a9af62ce6c051f9c9e2))
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
* **binparse:** typesafe binary parser ([5503ce3](https://github.com/blacha/diablo2/commit/5503ce302a597e860ddda608386f17e3e9624579))
