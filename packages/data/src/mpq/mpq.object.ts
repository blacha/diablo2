import { Diablo2MpqData } from './mpq.js';

export interface Diablo2Object {
  id: number;
  nameId: number;
}

export class Diablo2MpqObject {
  objects: Map<number, Diablo2Object> = new Map();
  mpq: Diablo2MpqData;

  constructor(mpq: Diablo2MpqData) {
    this.mpq = mpq;
  }

  add(object: Diablo2Object): void {
    this.objects.set(object.id, object);
  }

  name(objectId: number): string | undefined {
    return this.mpq.t(this.objects.get(objectId)?.nameId);
  }
}
