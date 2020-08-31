import * as path from 'path';
import { existsSync } from 'fs';
import { Diablo2MpqLang, Diablo2MpqMonsters } from './mpq.data';
import { Logger } from './log.type';

export class Diablo2Mpq {
  basePath: string;
  lang: Diablo2MpqLang = new Diablo2MpqLang(this);
  monsters: Diablo2MpqMonsters = new Diablo2MpqMonsters(this);

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  static async create(basePath: string, log?: Logger): Promise<Diablo2Mpq> {
    return new Diablo2Mpq(basePath).init(log);
  }

  /**
   * Translate a string using the lang files
   * @param id Id to translate
   */
  t(id: string | number | undefined, defaultValue: string | undefined = undefined): string | undefined {
    if (id == null) return defaultValue;
    if (typeof id == 'number') return this.lang.index[id]?.value;
    return this.lang.map.get(id)?.value;
  }

  async init(log?: Logger): Promise<Diablo2Mpq> {
    if (!existsSync(path.join(this.basePath, 'data'))) {
      log?.error({ basePath: this.basePath }, 'No /data found, mpq needs to be extracted');
      throw new Error('Failed to init no MPQ data found');
    }

    await this.lang.init(log);
    await this.monsters.init(log);
    return this;
  }
}
