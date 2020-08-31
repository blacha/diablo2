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
