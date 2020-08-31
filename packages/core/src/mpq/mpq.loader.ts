import { LangNode, LangReader, MonsterNode, MonsterReader } from '@diablo2/bintools';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Logger } from '../log.interface';

export class Diablo2MpqLang {
  map: Map<string, LangNode> = new Map();
  index: LangNode[] = [];

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
}

export class Diablo2MpqMonsters {
  lang: Diablo2MpqLang;
  map: Map<number, MonsterNode> = new Map();

  constructor(lang: Diablo2MpqLang) {
    this.lang = lang;
  }

  add(mon: MonsterNode): void {
    this.map.set(mon.id, mon);
  }

  get(monsterId: number): MonsterNode | undefined {
    return this.map.get(monsterId);
  }
}

/** Load all the `.tbl` files from a extracted MPQ to get item names  */
export async function loadLangFiles(basePath: string, logger: Logger): Promise<Diablo2MpqLang> {
  const lang = new Diablo2MpqLang();
  if (basePath == null || basePath == '') return lang;

  // TODO these lang files need to be extracted, would be good to load from the MPQ directly
  const LangPath = `${basePath}/mpq/data/local/LNG/ENG`;
  const langFolderFiles = await fs.readdir(LangPath);

  const langFiles = langFolderFiles.filter((f) => LangReader.LangFiles.find((lf) => f.toLowerCase().startsWith(lf)));
  for (const langFile of langFiles) {
    const startTime = Date.now();
    const bytes = await fs.readFile(path.join(LangPath, langFile));
    const langItems = LangReader.parse(bytes);
    const duration = Date.now() - startTime;

    for (const itm of langItems) lang.add(itm);
    logger.info({ file: langFile, records: langItems.length, duration }, 'MPQ:LoadLanguage');
  }

  return lang;
}

export async function loadMonsterFiles(
  basePath: string,
  lang: Diablo2MpqLang,
  logger: Logger,
): Promise<Diablo2MpqMonsters> {
  const mon = new Diablo2MpqMonsters(lang);
  if (basePath == null || basePath == '') return mon;

  // TODO these lang files need to be extracted, would be good to load from the MPQ directly
  const BinPath = `${basePath}/mpq/data/global/excel`;
  const binFolderFiles = await fs.readdir(BinPath);

  const monStatFile = binFolderFiles.find((f) => f.toLowerCase() == 'monstats.bin');
  if (monStatFile) {
    const startTime = Date.now();
    const bytes = await fs.readFile(path.join(BinPath, monStatFile));
    const monItems = MonsterReader.raw(bytes as any);
    const duration = Date.now() - startTime;

    for (const monster of monItems.monsters) mon.add(monster);
    logger.info({ file: monStatFile, records: monItems.monsters.length, duration }, 'MPQ:LoadMonster');
  }

  return mon;
}
