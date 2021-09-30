import { bp, StrutInfer } from 'binparse';
import { Process } from './process.js';
import { D2RStrut } from './struts/d2r.js';
import { Pointer } from './struts/pointer.js';

export type PointerFetcher<T> = (proc: Process) => Promise<T>;

export const PlayerStrut = bp.object('PlayerStrut', {
  name: bp.string(16),
  quest: bp.object('Quest', {
    normal: new Pointer(bp.lu32),
    nightmare: new Pointer(bp.lu32),
    hell: new Pointer(bp.lu32),
  }),
  waypoint: bp.object('Quest', {
    normal: new Pointer(bp.lu32),
    nightmare: new Pointer(bp.lu32),
    hell: new Pointer(bp.lu32),
  }),
});

export const ActStrut = bp.object('Act', {
  unk1: new Pointer(bp.lu32),
  unk2: new Pointer(bp.lu32),
  unk3: bp.lu32,
  mapSeed: bp.lu32,
});

export type ActS = StrutInfer<typeof ActStrut>;

export const StatStrut = bp.object('Stat', {
  unk1: bp.lu16,
  code: bp.lu16,
  value: bp.lu32,
});

export const StatListStrut = bp.object('StatList', {
  unk1: bp.bytes(12 * 4),
  pStat: new Pointer(StatStrut),
  count: bp.lu16,
  countB: bp.lu16,
});
export type StatList = StrutInfer<typeof StatListStrut>;

export const PathStrut = bp.object('Path', {
  xOffset: bp.lu16,
  x: bp.lu16,
  yOffset: bp.lu16,
  y: bp.lu16,
});
export type PathS = StrutInfer<typeof PathStrut>;

export type UnitPlayer = StrutInfer<typeof D2RStrut.UnitPlayer>;
