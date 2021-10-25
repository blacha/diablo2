import { bp, StrutInfer } from 'binparse';
import { Pointer } from './pointer.js';

export const D2StatStrut = bp.object('D2StatStrut', {
  unk1: bp.lu16,
  code: bp.lu16,
  value: bp.lu32,
});
export type StatS = StrutInfer<typeof D2StatStrut>;

export const D2StatListStrut = bp.object('D2StatListStrut', {
  unk1: bp.array('unk1', new Pointer(bp.u8), 3),
  unk2: bp.skip(6 * 4),
  pStats: new Pointer(D2StatStrut),
  count: bp.lu16,
  countB: bp.lu16,
});
export type StatListS = StrutInfer<typeof D2StatListStrut>;

export const D2PathStrut = bp.object('Path', {
  xOffset: bp.lu16,
  x: bp.lu16,
  yOffset: bp.lu16,
  y: bp.lu16,
});
export type PathS = StrutInfer<typeof D2PathStrut>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type PointerS<T = unknown> = { offset: number; isValid: boolean };

export interface ActS {
  mapSeed: number;
  pActMisc: PointerS<ActMiscS>;
}

export interface ActMiscS {
  difficulty: number;
}
