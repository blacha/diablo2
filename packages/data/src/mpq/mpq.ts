import { Diablo2MpqLang } from './mpq.lang';
import { Diablo2MpqMonsters } from './mpq.monster';

export class Diablo2MpqData {
  /** Last path to load MPQ data from */
  basePath: string;
  lang: Diablo2MpqLang;
  monsters: Diablo2MpqMonsters;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.lang = new Diablo2MpqLang(this);
    this.monsters = new Diablo2MpqMonsters(this);
  }

  /** Translate a key */
  t(key?: string | number): string | undefined {
    if (key == null) return undefined;
    if (typeof key == 'number') return this.lang.index[key];
    return this.lang.map.get(key);
  }
}

/** Static instance to a single copy of game data */
export const Diablo2Mpq = new Diablo2MpqData();
