import * as path from 'path';
import { promises as fs } from 'fs';
import { LangNode, LangReader } from './lang/lang.reader';
import { MonsterNode, MonsterReader } from './monster/monster.stat.reader';
import { Diablo2Mpq } from './mpq.loader';
import { Logger } from './log.type';

export class Diablo2MpqLang {
  map: Map<string, LangNode> = new Map();
  index: LangNode[] = [];
  mpq: Diablo2Mpq;

  constructor(mpq: Diablo2Mpq) {
    this.mpq = mpq;
  }

  add(itm: LangNode): void {
    if (itm.key == 'x' || itm.key == 'X') return;
    if (itm.value.trim() == '') return;
    this.map.set(itm.key, itm);
    this.index[itm.index] = itm;
  }

  get(key: string | number): string | undefined {
    if (typeof key == 'number') return this.index[key]?.value;
    return this.map.get(key)?.value;
  }

  /** Load in the lang files */
  async init(logger?: Logger): Promise<void> {
    // TODO these lang files need to be extracted, would be good to load from the MPQ directly
    const LangPath = `${this.mpq.basePath}/data/local/LNG/ENG`;
    const langFolderFiles = await fs.readdir(LangPath);

    const langFiles = langFolderFiles.filter((f) => LangReader.LangFiles.find((lf) => f.toLowerCase().startsWith(lf)));
    for (const langFile of langFiles) {
      const startTime = Date.now();
      const bytes = await fs.readFile(path.join(LangPath, langFile));
      const langItems = LangReader.parse(bytes);
      const duration = Date.now() - startTime;

      for (const itm of langItems) this.add(itm);
      logger?.debug({ file: langFile, records: langItems.length, duration }, 'MPQ:LoadLanguage');
    }
  }
}

export class Diablo2MpqMonsters {
  map: Map<number, MonsterNode> = new Map();
  mpq: Diablo2Mpq;

  constructor(mpq: Diablo2Mpq) {
    this.mpq = mpq;
  }

  add(mon: MonsterNode): void {
    this.map.set(mon.id, mon);
  }

  get(monsterId: number): MonsterNode | undefined {
    return this.map.get(monsterId);
  }

  /** Load in the lang files */
  async init(logger?: Logger): Promise<void> {
    // TODO these lang files need to be extracted, would be good to load from the MPQ directly
    const BinPath = `${this.mpq.basePath}/data/global/excel`;
    const binFolderFiles = await fs.readdir(BinPath);

    const monStatFile = binFolderFiles.find((f) => f.toLowerCase() == 'monstats.bin');
    if (monStatFile) {
      const startTime = Date.now();
      const bytes = await fs.readFile(path.join(BinPath, monStatFile));
      const monItems = MonsterReader.raw(bytes as any);
      const duration = Date.now() - startTime;

      for (const monster of monItems.monsters) this.add(monster);
      logger?.debug({ file: monStatFile, records: monItems.monsters.length, duration }, 'MPQ:LoadMonster');
    }
  }
}
