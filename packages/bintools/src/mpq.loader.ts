import * as path from 'path';
import { existsSync } from 'fs';
import { Logger } from './log.type';
import { Diablo2Mpq, Diablo2MpqData } from '@diablo2/data';
import { promises as fs } from 'fs';
import { MonsterReader, MonsterReader2 } from './monster/monster.stat.reader';
import { LangReader } from './lang/lang.reader';

export class Diablo2MpqLoader {
  static async init(basePath: string, log?: Logger, mpq = Diablo2Mpq): Promise<Diablo2MpqData> {
    if (!existsSync(path.join(basePath, 'data'))) {
      log?.error({ basePath: basePath }, 'No /data found, mpq needs to be extracted');
      throw new Error('Failed to init no MPQ data found');
    }

    mpq.basePath = basePath;
    await this.initLang(mpq, log);
    await this.initMonsters(mpq, log);
    return mpq;
  }

  /** Load in the lang files */
  static async initLang(mpq: Diablo2MpqData, logger?: Logger): Promise<void> {
    // TODO these lang files need to be extracted, would be good to load from the MPQ directly
    const LangPath = `${mpq.basePath}/data/local/LNG/ENG`;
    const langFolderFiles = await fs.readdir(LangPath);

    const langFiles = langFolderFiles.filter((f) => LangReader.LangFiles.find((lf) => f.toLowerCase().startsWith(lf)));
    for (const langFile of langFiles) {
      const startTime = Date.now();
      const bytes = await fs.readFile(path.join(LangPath, langFile));
      const langItems = LangReader.parse(bytes);
      const duration = Date.now() - startTime;

      for (const itm of langItems) mpq.lang.add(itm.key, itm.index, itm.value);
      logger?.debug({ file: langFile, records: langItems.length, duration }, 'MPQ:Load:Language');
    }
  }

  /** Load in the lang files */
  static async initMonsters(mpq: Diablo2MpqData, logger?: Logger): Promise<void> {
    // TODO these lang files need to be extracted, would be good to load from the MPQ directly
    const BinPath = `${mpq.basePath}/data/global/excel`;
    const binFolderFiles = await fs.readdir(BinPath);

    const monStatFile = binFolderFiles.find((f) => f.toLowerCase() == 'monstats.bin');
    if (monStatFile) {
      const startTime = Date.now();
      const bytes = await fs.readFile(path.join(BinPath, monStatFile));
      const monItems = MonsterReader.raw(bytes as any);
      const duration = Date.now() - startTime;

      for (const monster of monItems.monsters) mpq.monsters.add(monster.id, monster.nameLangId);
      logger?.debug({ file: monStatFile, records: monItems.monsters.length, duration }, 'MPQ:Load:Monster');
    }

    const monStat2File = binFolderFiles.find((f) => f.toLowerCase() == 'monstats2.bin');
    if (monStat2File) {
      const startTime = Date.now();
      const bytes = await fs.readFile(path.join(BinPath, monStat2File));
      const monItems = MonsterReader2.raw(bytes as any);
      const duration = Date.now() - startTime;

      for (const mon of monItems.monsters) {
        mpq.monsters.addState(mon.id, mon.state);
      }

      logger?.debug({ file: monStat2File, records: monItems.monsters.length, duration }, 'MPQ:Load:Monster2');
    }
  }
}
