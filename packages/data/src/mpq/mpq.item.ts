import { Diablo2MpqData } from './mpq.js';

export interface Diablo2Item {
  code: string;
  nameId: number;
}

export class Diablo2MpqItem {
  byCode: Map<string, Diablo2Item> = new Map();
  byIndex: Diablo2Item[] = [];
  mpq: Diablo2MpqData;

  constructor(mpq: Diablo2MpqData) {
    this.mpq = mpq;
  }

  add(item: Diablo2Item): void {
    this.byCode.set(item.code, item);
    this.byIndex.push(item);
  }
}
