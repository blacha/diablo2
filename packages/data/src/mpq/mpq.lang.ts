import { Diablo2MpqData } from './mpq';

export class Diablo2MpqLang {
  /** Translations by key */
  map: Map<string, string> = new Map();
  /** Translations by index */
  index: string[] = [];
  mpq: Diablo2MpqData;

  constructor(mpq: Diablo2MpqData) {
    this.mpq = mpq;
  }

  /** Add a key with index into the translation tables */
  add(key: string, index: number, value: string): void {
    if (key == 'x' || key == 'X') return;
    if (value.trim() == '') return;
    this.map.set(key, value);
    this.index[index] = value;
  }
}
