import { Act } from '../act.js';
import { Diablo2MpqItem } from './mpq.item.js';
import { Diablo2MpqLang } from './mpq.lang.js';
import { Diablo2MpqMonsters } from './mpq.monster.js';
import { Diablo2MpqObject } from './mpq.object.js';

export interface Diablo2Level {
  id: number;
  act: Act;
  name: string;
  isRaining: boolean;
  isTeleportEnabled: boolean;
}

export class Diablo2MpqData {
  /** Last path to load MPQ data from */
  basePath: string;
  lang: Diablo2MpqLang;
  monsters: Diablo2MpqMonsters;
  items: Diablo2MpqItem;
  objects: Diablo2MpqObject;
  levels: Map<number, Diablo2Level> = new Map();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.lang = new Diablo2MpqLang(this);
    this.monsters = new Diablo2MpqMonsters(this);
    this.items = new Diablo2MpqItem(this);
    this.objects = new Diablo2MpqObject(this);
  }

  /** Translate a key */
  t(key?: number | string): string | undefined {
    if (key == null) return undefined;
    if (typeof key === 'number') return this.lang.getByIndex(key);
    return this.lang.getByKey(key);
  }
}

/** Static instance to a single copy of game data */
export const Diablo2Mpq = new Diablo2MpqData();
