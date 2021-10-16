import { Diablo2Mpq, Diablo2MpqData } from '@diablo2/data';
import { Mpq } from '@diablo2/mpq';
import { StrutInfer, StrutType } from 'binparse';
import * as path from 'path';
import { Logger } from './log.type.js';
import { ItemFileParser } from './readers/item.reader.js';
import { LangReader } from './readers/lang.reader.js';
import { LevelReader } from './readers/level.reader.js';
import { MonsterReader, MonsterReader2 } from './readers/monster.stat.reader.js';
import { ObjectReader } from './readers/object.reader.js';

const LangFiles = ['string.tbl', 'expansionstring.tbl', 'patchstring.tbl'];
// Order matters for item imports
const ItemFiles = ['Weapons.bin', 'Armor.bin', 'Misc.bin'];

export class Diablo2MpqLoader {
  static MpqPatch: Mpq;
  static MpqExp: Mpq;
  static MpqData: Mpq;

  static async readAndParse<T extends StrutType<any>>(
    key: string,
    parser: T,
  ): Promise<{ value: StrutInfer<T>; duration: number } | null> {
    try {
      const startTime = Date.now();
      const mpq = await this.getMpq(key);
      if (mpq == null) return null;
      const bytes = await mpq.extract(key);
      if (bytes == null) return null;
      const value = parser.parse(bytes, { offset: 0, startOffset: 0 });
      const duration = Date.now() - startTime;
      return { value, duration };
    } catch (e) {
      // ignore
      console.log(e);
    }
    return null;
  }

  static async load(basePath: string, log?: Logger, data = Diablo2Mpq): Promise<Diablo2MpqData> {
    log?.info({ mpq: basePath }, 'Mpq:Load');

    this.MpqPatch = Mpq.load(path.join(basePath, 'patch_d2.mpq'));
    this.MpqData = Mpq.load(path.join(basePath, 'd2data.mpq'));
    this.MpqExp = Mpq.load(path.join(basePath, 'd2exp.mpq'));

    data.basePath = basePath;

    await Promise.all([
      this.initLang(data, log),
      this.initLevels(data, log),
      this.initObjects(data, log),
      this.initMonsters(data, log),
      this.initItems(data, log),
    ]);

    return data;
  }

  static async getMpq(path: string): Promise<Mpq | null> {
    if (await this.MpqPatch.has(path)) return this.MpqPatch;
    if (await this.MpqExp.has(path)) return this.MpqExp;
    if (await this.MpqData.has(path)) return this.MpqData;
    return null;
  }

  static async initLevels(data: Diablo2MpqData, logger?: Logger): Promise<void> {
    const res = await this.readAndParse('data/global/excel/levels.bin', LevelReader);
    if (res == null) return logger?.warn({ file: 'data/global/excel/levels.bin' }, 'Mpq:Load:Failed');
    for (const r of res?.value.levels) data.levels.set(r.id, r);

    logger?.debug({ file: 'levels.bin', records: data.levels.size, duration: res.duration }, 'Mpq:Load:Levels');
  }

  static async initObjects(data: Diablo2MpqData, logger?: Logger): Promise<void> {
    const res = await this.readAndParse('data/global/excel/objects.bin', ObjectReader);
    if (res == null) return logger?.warn({ file: 'data/global/excel/objects.bin' }, 'Mpq:Load:Failed');
    for (let i = 0; i < res.value.objects.length; i++) {
      const r = res.value.objects[i];
      data.objects.set(i, r);
    }
    logger?.debug({ file: 'objects.bin', records: data.levels.size, duration: res.duration }, 'Mpq:Load:Levels');
  }

  /** Load in the lang files */
  static async initLang(data: Diablo2MpqData, logger?: Logger): Promise<void> {
    for (const langFile of LangFiles) {
      const res = await this.readAndParse(`data/local/LNG/ENG/${langFile}`, LangReader);
      if (res == null) {
        logger?.warn({ file: langFile }, 'Mpq:Load:Failed');
        continue;
      }
      const langItems = res.value.hashTable;
      switch (langFile) {
        case 'string.tbl':
          for (const itm of langItems) data.lang.classic.add(itm.key, itm.index, itm.value);
          break;
        case 'patchstring.tbl':
          for (const itm of langItems) data.lang.patch.add(itm.key, itm.index, itm.value);
          break;
        case 'expansionstring.tbl':
          for (const itm of langItems) data.lang.expansion.add(itm.key, itm.index, itm.value);
          break;
        default:
          throw new Error('Invalid lang file ' + langFile);
      }

      logger?.debug({ file: langFile, records: langItems.length, duration: res.duration }, 'Mpq:Load:Language');
    }
  }

  /** Load in the lang files */
  static async initMonsters(data: Diablo2MpqData, logger?: Logger): Promise<void> {
    const res = await this.readAndParse('data/global/excel/monstats.bin', MonsterReader);
    if (res == null) return logger?.warn({ file: 'MonStats.bin' }, 'Mpq:Load:Failed');

    const monsters = res.value.monsters;
    for (const mon of monsters) data.monsters.add(mon.id, mon);
    logger?.debug({ file: 'MonStats.bin', records: monsters.length, duration: res.duration }, 'Mpq:Load:Monster');

    const res2 = await this.readAndParse('data/global/excel/MonStats2.bin', MonsterReader2);
    if (res2 == null) return logger?.warn({ file: 'MonStats2.bin' }, 'Mpq:Load:Failed');

    const monsters2 = res2.value.monsters;
    for (const mon of monsters2) data.monsters.addState(mon.id, mon.state);
    logger?.debug({ file: 'MonStats2.bin', records: monsters2.length, duration: res2.duration }, 'Mpq:Load:Monster');
  }

  static async initItems(data: Diablo2MpqData, logger?: Logger): Promise<void> {
    for (const itemFile of ItemFiles) {
      const res = await this.readAndParse(`data/global/excel/${itemFile}`, ItemFileParser);
      if (res == null) {
        logger?.warn({ file: itemFile }, 'Mpq:Load:Failed');
        continue;
      }
      const items = res.value.items;

      for (const item of items) data.items.add(item);
      logger?.debug({ file: itemFile, records: items.length, duration: res.duration }, 'Mpq:Load:Items');
    }
  }
}
