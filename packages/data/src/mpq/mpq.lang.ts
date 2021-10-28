import { Diablo2MpqData } from './mpq.js';

export const ExpansionOffset = 20000;
export const PatchOffset = 10000;
export const ClassicOffset = 0;

export class Diablo2MpqLangTbl {
  /** Translations by key */
  byKey: Map<string, string> = new Map();
  /** Translations by index */
  byIndex: string[] = [];

  add(key: string, index: number, value: string): void {
    this.byIndex[index] = value;

    if (key === 'x' || key === 'X') return;
    if (value.trim() === '') return;
    const existingKey = this.byKey.get(key);
    if (existingKey) {
      if (existingKey.trim() === value.trim()) return;
    }
    this.byKey.set(key, value);
  }

  get(index: number): string | undefined {
    return this.byIndex[index];
  }
}

export class Diablo2MpqLang {
  expansion = new Diablo2MpqLangTbl();
  patch = new Diablo2MpqLangTbl();
  classic = new Diablo2MpqLangTbl();

  mpq: Diablo2MpqData;

  constructor(mpq: Diablo2MpqData) {
    this.mpq = mpq;
  }

  get size(): number {
    return this.expansion.byKey.size + this.patch.byKey.size + this.classic.byKey.size;
  }

  getByIndex(index: number): string | undefined {
    // This is a commonly used bad key?
    if (index === 5382) return undefined;
    if (index >= ExpansionOffset) return this.expansion.get(index - ExpansionOffset);
    if (index >= PatchOffset) return this.patch.get(index - PatchOffset);
    return this.classic.get(index);
  }

  getByKey(key: string): string | undefined {
    const exp = this.expansion.byKey.get(key);
    if (exp != null) return exp;
    const patch = this.patch.byKey.get(key);
    if (patch != null) return patch;
    return this.classic.byKey.get(key);
  }
}
