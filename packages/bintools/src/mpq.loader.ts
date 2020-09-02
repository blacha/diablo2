import { Diablo2Mpq, Diablo2MpqData } from '@diablo2/data';
import { StrutInfer, StrutType } from 'binparse';
import { existsSync, promises as fs } from 'fs';
import * as path from 'path';
import { ItemFileParser } from './item/item.reader';
import { LangReader } from './lang/lang.reader';
import { Logger } from './log.type';
import { MonsterReader, MonsterReader2 } from './monster/monster.stat.reader';

async function readAndParse<T extends StrutType<any>>(
  basePath: string,
  fileName: string,
  parser: T,
): Promise<{ value: StrutInfer<T>; duration: number } | null> {
  try {
    const startTime = Date.now();
    const bytes = await fs.readFile(path.join(basePath, fileName));
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

export class Diablo2MpqLoader {
  static async load(basePath: string, log?: Logger, mpq = Diablo2Mpq): Promise<Diablo2MpqData> {
    if (!existsSync(path.join(basePath, 'data'))) {
      log?.error({ basePath: basePath }, 'No /data found, mpq needs to be extracted');
      throw new Error('Failed to init no MPQ data found');
    }

    mpq.basePath = basePath;
    await this.initLang(mpq, log);
    await this.initMonsters(mpq, log);
    await this.initItems(mpq, log);
    return mpq;
  }

  /** Load in the lang files */
  static async initLang(mpq: Diablo2MpqData, logger?: Logger): Promise<void> {
    const LangPath = `${mpq.basePath}/data/local/LNG/ENG`;

    for (const langFile of LangFiles) {
      const res = await readAndParse(LangPath, langFile, LangReader);
      if (res == null) continue;

      const langItems = res.value.hashTable;
      for (const itm of langItems) {
        switch (langFile) {
          case 'string.tbl':
            mpq.lang.classic.add(itm.key, itm.index, itm.value);
            break;
          case 'patchstring.tbl':
            mpq.lang.patch.add(itm.key, itm.index, itm.value);
            break;
          case 'expansionstring.tbl':
            mpq.lang.expansion.add(itm.key, itm.index, itm.value);
            break;
          default:
            throw new Error('invalid lang file ' + langFile);
        }
      }
      logger?.debug({ file: langFile, records: langItems.length, duration: res.duration }, 'MPQ:Load:Language');
    }
  }

  /** Load in the lang files */
  static async initMonsters(mpq: Diablo2MpqData, logger?: Logger): Promise<void> {
    const BinPath = `${mpq.basePath}/data/global/excel`;
    const res = await readAndParse(BinPath, 'MonStats.bin', MonsterReader);
    if (res) {
      const monsters = res.value.monsters;
      for (const mon of monsters) {
        mpq.monsters.add(mon.id, mon);
      }
      logger?.debug({ file: 'MonStats.bin', records: monsters.length, duration: res.duration }, 'MPQ:Load:Monster');
    }

    const res2 = await readAndParse(BinPath, 'MonStats2.bin', MonsterReader2);
    if (res2) {
      const monsters2 = res2.value.monsters;
      for (const mon of monsters2) {
        mpq.monsters.addState(mon.id, mon.state);
      }
      logger?.debug({ file: 'MonStats2.bin', records: monsters2.length, duration: res2.duration }, 'MPQ:Load:Monster');
    }
  }

  static async initItems(mpq: Diablo2MpqData, logger?: Logger): Promise<void> {
    //   // TODO these lang files need to be extracted, would be good to load from the MPQ directly
    const BinPath = `${mpq.basePath}/data/global/excel`;
    //
    for (const itemFile of ItemFiles) {
      const res = await readAndParse(BinPath, itemFile, ItemFileParser);
      if (res == null) continue;
      const items = res.value.items;

      for (const item of items) mpq.items.add(item);

      logger?.debug({ file: itemFile, records: items.length, duration: res.duration }, 'MPQ:Load:Items');
    }
  }
}
