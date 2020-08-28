import { bp } from 'binparse';

const Item = bp.object('Item', {
  name: bp.string(32),
  files: bp.object('ItemFiles', {
    normal: bp.string(32),
    unique: bp.string(32),
    set: bp.string(32),
  }),
  code: bp.string(4),
  codes: bp.object('ItemCodes', {
    normal: bp.string(4),
    unique: bp.string(4),
    set: bp.string(4),
  }),
  altGfx: bp.string(4),
  unk1: bp.skip(40),
  betterGem: bp.string(4),
  weaponClass: bp.lu32,
  weaponClass2Hand: bp.lu32,
  transmogrify: bp.lu32,
  minAc: bp.lu32,
  maxAc: bp.lu32,
  gambleCost: bp.lu32,
  speed: bp.lu32,
  bitField1: bp.lu32,
  cost: bp.lu32,
  minStack: bp.lu32,
  maxStack: bp.lu32,
  spawnStack: bp.lu32,
  gemOffset: bp.lu32,
  nameLang: bp.lu16,

  unk2: bp.skip(220 - 13 * 4 - 2),
  upgrade: bp.object('ItemUpgrades', {
    nightmare: bp.string(4),
    hell: bp.string(4),
  }),
  unk3: bp.skip(4),
});

export const ItemFileParser = bp.object('Items', {
  count: bp.variable('count', bp.lu32),
  items: bp.array('Items', Item, 'count'),
});
