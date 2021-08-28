import { bp, StrutAny, StrutBase, StrutInfer, StrutParserContext, StrutType } from 'binparse';
import { ProcessMemory } from './process';

export type PointerFetcher<T> = (proc: ProcessMemory) => Promise<T>;
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

  async fetch(offset: number, proc: ProcessMemory): Promise<StrutInfer<T>> {
    const bytes = await proc.read(offset, this.target.size);
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

export const Act = bp.object('Act', {
  unk1: bp.lu32,
  unk2: bp.lu32,
  unk3: bp.lu32,
  mapSeed: bp.lu32,
});

export const Stat = bp.object('Stat', {
  unk1: bp.lu16,
  code: bp.lu16,
  value: bp.lu32,
});

export const UnitAnyPlayer = bp.object('UnitAnyPlayer', {
  type: bp.lu32,
  txtFileNo: bp.lu32,
  unitId: bp.lu32,
  mode: bp.lu32,
  /** Pointer to PlayerStrut */
  pPlayer: new Pointer<typeof PlayerStrut>(PlayerStrut),
  actId: bp.lu32,
  /** Pointer to Act */
  pAct: new Pointer(Act),
});
