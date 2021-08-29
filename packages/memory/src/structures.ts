import { bp, StrutAny, StrutBase, StrutInfer, StrutParserContext } from 'binparse';
import { Process } from './process';

export type PointerFetcher<T> = (proc: Process) => Promise<T>;
export class Pointer<T extends StrutAny> extends StrutBase<{
  offset: number;
  fetch: PointerFetcher<StrutInfer<T>>;
}> {
  /** Configure pointer to be 32 or 64 bit */
  static type = bp.lu32;
  target: T;
  constructor(target: T) {
    super('Pointer:' + target.name);
    this.target = target;
  }

  get size(): number {
    return Pointer.type.size;
  }

  parse(bytes: Buffer, pkt: StrutParserContext): { offset: number; fetch: PointerFetcher<StrutInfer<T>> } {
    const offset = Pointer.type.parse(bytes, pkt);
    // if (offset > 0xfffffff) throw new Error('');
    const fetch = this.fetch.bind(this, offset);
    return { offset, fetch };
  }

  async fetch(offset: number, proc: Process): Promise<StrutInfer<T>> {
    const bytes = await proc.memory(offset, this.target.size);
    const res = this.target.raw(bytes, 0);
    return res;
  }
}

export const PlayerStrut = bp.object('PlayerStrut', {
  name: bp.string(16),
  quest: bp.object('Quest', {
    normal: bp.lu32,
    nightmare: bp.lu32,
    hell: bp.lu32,
  }),
  waypoint: bp.object('Quest', {
    normal: bp.lu32,
    nightmare: bp.lu32,
    hell: bp.lu32,
  }),
});

export const ActStrut = bp.object('Act', {
  unk1: bp.lu32,
  unk2: bp.lu32,
  unk3: bp.lu32,
  mapSeed: bp.lu32,
});
export type Act = StrutInfer<typeof ActStrut>;

export const StatStrut = bp.object('Stat', {
  unk1: bp.lu16,
  code: bp.lu16,
  value: bp.lu32,
});

export const StatListStrut = bp.object('StatList', {
  unk1: bp.bytes(9 * 4),
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
export type Path = StrutInfer<typeof PathStrut>;

export const UnitAnyPlayerStrut = bp.object('UnitAnyPlayer', {
  type: bp.lu32,
  txtFileNo: bp.lu32,
  unitId: bp.lu32,
  mode: bp.lu32,
  /** Pointer to PlayerStrut */
  pPlayer: new Pointer(PlayerStrut),
  actId: bp.lu32,
  /** Pointer to Act */
  pAct: new Pointer(ActStrut),
  seedA: bp.lu32,
  seedB: bp.lu32,
  unk2: bp.lu32,
  pPath: new Pointer(PathStrut),
  unk3: bp.skip(44),
  pStats: new Pointer(StatListStrut),
});

export type UnitPlayer = StrutInfer<typeof UnitAnyPlayerStrut>;
