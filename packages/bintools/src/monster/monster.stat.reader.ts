import { bp, StrutInfer } from 'binparse';

const MonsterParser = bp.object('Monster', {
  id: bp.lu16,
  baseId: bp.lu16,
  baseNextId: bp.lu16,
  /** Name index, lookup inside of lang index */
  nameLangId: bp.lu16,
  /** Description lookup inside of lang index */
  descriptionLangId: bp.lu16,
  unk1: bp.lu16,
  flags: bp.lu32,
  code: bp.lu32,
  unk100: bp.skip(424 - 20),
});

export type MonsterNode = StrutInfer<typeof MonsterParser>;

export const MonsterReader = bp.object('Monsters', {
  count: bp.variable('count', bp.lu32),
  monsters: bp.array('Monster', MonsterParser, 'count'),
});

const Monster2Parser = bp.object('Monster2', {
  id: bp.lu32,
  unk1: bp.lu32,
  sizeX: bp.u8,
  sizeY: bp.u8,
  unk2: bp.skip(11),
  /** This state is used to read the NpcAssign packet */
  state: bp.array('MonsterState', bp.u8, 16),
  unk100: bp.bytes(0x134 - 10 - 11 - 16),
});
/** MonStats2.bin */
export const MonsterReader2 = bp.object('Monsters2', {
  count: bp.variable('count', bp.lu32),
  monsters: bp.array('Monster', Monster2Parser, 'count'),
});
