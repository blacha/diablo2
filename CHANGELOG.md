# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/blacha/diablo2/compare/v0.4.0...v0.5.0) (2021-03-26)


### Bug Fixes

* **packets/pd2:** correct parsing of packet 0x56 ([459ef8a](https://github.com/blacha/diablo2/commit/459ef8a7181a08ebf0cb76ea778a4703240a3554))
* expose npc enchants out of game state ([2a933c2](https://github.com/blacha/diablo2/commit/2a933c2fae9eae13272c2e115f0a444116c88f98))
* **bintools:** parsing of tbl files where the hash count and index count differ ([77d2f85](https://github.com/blacha/diablo2/commit/77d2f8504dabf76ac73c23ac0efc380bfe2eb1a1))
* **core:** skip packet 0x2b as we cannot parse it right now ([4eb2001](https://github.com/blacha/diablo2/commit/4eb2001e291aef70a27842cd1d60c1da19268503))
* **map:** skip mapid 150 on pd2 as it doesnt seem to work yet ([a268073](https://github.com/blacha/diablo2/commit/a2680739a8615e01f7562c25a52d35155cb56393))
* **mpq:** allow extraction of uncompressed files ([25edc0c](https://github.com/blacha/diablo2/commit/25edc0c0eb05a77e86f22780cd54a1e138088675))
* **mpq:** correct exploding of implode compressed mpq ([f0e50d7](https://github.com/blacha/diablo2/commit/f0e50d7057bbb6ec77303f13ecaf0184312f87ed))
* **packets:** actually export all the packets ([bc7b6c2](https://github.com/blacha/diablo2/commit/bc7b6c22d60413b9e3d27a9b9aeada341d90011e))
* **sniffer:** force close the game if the session cuts out ([3390faa](https://github.com/blacha/diablo2/commit/3390faa4a7cf777ac3e5b111ce03d0994c4fcf42))


### Features

* **core:** basic game state from packets flowing though it ([#10](https://github.com/blacha/diablo2/issues/10)) ([c052059](https://github.com/blacha/diablo2/commit/c052059bbe2a62957cbfd877016fdabc1affe13c))
* **core:** easier debugging of packet parse failures ([3958f68](https://github.com/blacha/diablo2/commit/3958f68dda26be71163ba97054232ad9a9efe455))
* **core:** expand on game state tracking ([7e6dcc7](https://github.com/blacha/diablo2/commit/7e6dcc77d801e919ddfcd6cb6c3077a1f6dd8073))
* **core:** filter out old objects if they havent been seen in a while ([2a01ea6](https://github.com/blacha/diablo2/commit/2a01ea66eb33d785de8c4332ba690e2c29c5e5fe))
* **core:** improve xp tracking ([6a1e757](https://github.com/blacha/diablo2/commit/6a1e757f4c5e03fbce0ef658ff27813f680eb215))
* **core:** track when monsters die ([6309f29](https://github.com/blacha/diablo2/commit/6309f292446d0d5cd4ba015c7d8d91ad44356398))
* **core:** track when packets are not parsed correctly ([0ed0975](https://github.com/blacha/diablo2/commit/0ed0975b8d56be24d8db4e18942bc4692505e7f8))
* **data:** expose toHex function ([86e6dbd](https://github.com/blacha/diablo2/commit/86e6dbd7147280c25a6150c4d311c83c1199c3d4))
* **mpq:** alias exists to has ([613888f](https://github.com/blacha/diablo2/commit/613888f2e449f7ce4ccdbca6c6dbef000c09202b))
* **packets:** support unknown 0x56 packet for pd2 ([33b25de](https://github.com/blacha/diablo2/commit/33b25dea35335f046730ba5778466ed79da4a041))
* **sniffer:** change packet output location to `packets-${date)-${id}.ndjson` ([108ef99](https://github.com/blacha/diablo2/commit/108ef993efcf648aeb6027f58357da38e1087a4f))
* **sniffer:** include hour in replay filename ([0cabc6d](https://github.com/blacha/diablo2/commit/0cabc6df1e3d37c33708691b6d741f5a2cbbc94c))
* add NpcEnchants to track modifiers to Npcs ([9c602c4](https://github.com/blacha/diablo2/commit/9c602c4dbc8973a5c65dd6659b1f46c44f640da0))
* **sniffer:** expose findLocalIps function ([9c4d1d7](https://github.com/blacha/diablo2/commit/9c4d1d76341bde934b341c9a06500b9d45a5005d))





# [0.4.0](https://github.com/blacha/diablo2/compare/v0.3.0...v0.4.0) (2020-11-06)


### Features

* support both pod and pd2 ([d89f86e](https://github.com/blacha/diablo2/commit/d89f86ed5cd5ce1966ad71f8d10c55f4b09e2add))
* support project diablo2 ([f794865](https://github.com/blacha/diablo2/commit/f79486559a6e0c9a5bb37607d0361fe873500f2c))
* **map:** cache map generations in memory ([24f1bdd](https://github.com/blacha/diablo2/commit/24f1bdd0db415b9246aa9f85b4f16b0e5e045d98))
* **packets:** add missing 0xaa StateAdd packet ([c31f565](https://github.com/blacha/diablo2/commit/c31f5657f6510a8ac2f58170a7984b98a3e002dc))





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
