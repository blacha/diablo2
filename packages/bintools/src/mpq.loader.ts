import { Diablo2Mpq, Diablo2MpqData } from '@diablo2/data';
import { Mpq } from '@diablo2/mpq';
import { StrutInfer, StrutType } from 'binparse';
import { promises as fs } from 'fs';
import * as path from 'path';
import { ItemFileParser } from './item/item.reader';
import { LangReader } from './lang/lang.reader';
import { Logger } from './log.type';
import { MonsterReader, MonsterReader2 } from './monster/monster.stat.reader';

async function readAndParse<T extends StrutType<any>>(
  mpq: Mpq,
  key: string,
  parser: T,
): Promise<{ value: StrutInfer<T>; duration: number } | null> {
  try {
    const startTime = Date.now();
    const bytes = await mpq.extract(key);
    if (bytes == null) return null;
    const value = parser.parse(bytes, { offset: 0, startOffset: 0 });
    const duration = Date.now() - startTime;
    return { value, duration };
  } catch (e) {
    // ignore
  }
  return null;
}

const LangFiles = ['string.tbl', 'expansionstring.tbl', 'patchstring.tbl'];
// Order matters for item imports
const ItemFiles = ['Weapons.bin', 'Armor.bin', 'Misc.bin'];
const MpqFile = 'patch_d2.mpq';

export class Diablo2MpqLoader {
  static async load(basePath: string, log?: Logger, data = Diablo2Mpq): Promise<Diablo2MpqData> {
    const mpqFilePath = path.join(basePath, MpqFile);
    log?.info({ mpq: mpqFilePath }, 'Mpq:Load');

    const mpqData = await fs.readFile(mpqFilePath);
    const mpqReader = Mpq.load(mpqData);

    data.basePath = basePath;
    await this.initLang(data, mpqReader, log);
    await this.initMonsters(data, mpqReader, log);
    await this.initItems(data, mpqReader, log);
    return data;
  }

  /** Load in the lang files */
  static async initLang(data: Diablo2MpqData, mpq: Mpq, logger?: Logger): Promise<void> {
    for (const langFile of LangFiles) {
      const res = await readAndParse(mpq, `data/local/LNG/ENG/${langFile}`, LangReader);
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
  static async initMonsters(data: Diablo2MpqData, mpq: Mpq, logger?: Logger): Promise<void> {
    const res = await readAndParse(mpq, 'data/global/excel/monstats.bin', MonsterReader);
    if (res == null) return logger?.warn({ file: 'MonStats.bin' }, 'Mpq:Load:Failed');

    const monsters = res.value.monsters;
    for (const mon of monsters) data.monsters.add(mon.id, mon);
    logger?.debug({ file: 'MonStats.bin', records: monsters.length, duration: res.duration }, 'Mpq:Load:Monster');

    const res2 = await readAndParse(mpq, 'data/global/excel/MonStats2.bin', MonsterReader2);
    if (res2 == null) return logger?.warn({ file: 'MonStats2.bin' }, 'Mpq:Load:Failed');

    const monsters2 = res2.value.monsters;
    for (const mon of monsters2) data.monsters.addState(mon.id, mon.state);
    logger?.debug({ file: 'MonStats2.bin', records: monsters2.length, duration: res2.duration }, 'Mpq:Load:Monster');
  }

  static async initItems(data: Diablo2MpqData, mpq: Mpq, logger?: Logger): Promise<void> {
    for (const itemFile of ItemFiles) {
      const res = await readAndParse(mpq, `data/global/excel/${itemFile}`, ItemFileParser);
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
