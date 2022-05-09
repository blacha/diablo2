import { bp, StrutInfer } from 'binparse';
import { Pointer } from './pointer.js';

const { at } = bp;

export const D2rWaypointData = bp.object('D2rWaypoint', {});
export const D2rQuestData = bp.object('D2rQuest', {});
export const D2rArenaUnit = bp.object('D2rArenaUnit', {});
export const D2rPlayerTrade = bp.object('D2rPlayerTrade', {});
export const D2rClient = bp.object('D2rClient', {});

export const D2rUnk = bp.object('D2rUnk', {});

export const D2rStatStrut = bp.object('D2StatStrut', {
  unk1: bp.lu16,
  code: bp.lu16,
  value: bp.lu32,
});
export type StatS = StrutInfer<typeof D2rStatStrut>;

export const D2rStatListStrut = bp.object('D2StatListStrut', {
  pStats: at(0x30, new Pointer(D2rStatStrut)),
  count: bp.lu16,
  countB: bp.lu16,
});
D2rStatListStrut.setSize(0x3c);
export type StatListS = StrutInfer<typeof D2rStatListStrut>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type PointerS<T = unknown> = { offset: number; isValid: boolean };
