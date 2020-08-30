import { LangNode, LangReader } from '@diablo2/bintools';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Logger } from '../log.interface';

export class Diablo2Lang {
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

/** Load all the `.tbl` files from a extracted MPQ to get item names  */
export async function loadLangFiles(basePath: string, logger: Logger): Promise<Diablo2Lang> {
  const lang = new Diablo2Lang();
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
    logger.info({ file: langFile, records: langItems.length, duration }, 'Load language file');
  }
  return lang;
}
