import { bp } from 'binparse';

const Monster = bp.object('Monster', {
  id: bp.lu16,
  baseId: bp.lu16,
  baseNextId: bp.lu16,
  name: bp.lu16,
  description: bp.lu16,
  unk1: bp.lu16,
  flags: bp.lu32,
  code: bp.lu32,
  unk100: bp.skip(424 - 20),
});

export const MonsterReader = bp.object('Monsters', {
  count: bp.variable('count', bp.lu32),
  monsters: bp.array('Monster', Monster, 'count'),
});
