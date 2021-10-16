import { bp, StrutInfer } from 'binparse';

const baseObj = {
  name: bp.string(64),
  nameW: bp.string(64),
  token: bp.string(3),
  spawnMax: bp.u8,
  skip1: bp.skip(8),
  trapProb: bp.u8,
  skip2: bp.skip(3),
  x: bp.lu32,
  y: bp.lu32,

  skip3: bp.skip(0x13a - 0xd8),

  isDoor: bp.u8,
  isVisibilityBlocked: bp.u8,
  orientation: bp.u8,

  skip4: bp.skip(0x148 - 0x13d),
  xOffset: bp.lu32,
  yOffset: bp.lu32,

  skip5: bp.skip(0x162 - 0x150),
  xSpace: bp.u8,
  ySpace: bp.u8,

  red: bp.u8,
  green: bp.u8,
  blue: bp.u8,
  subClass: bp.u8,

  skipToEnd: bp.skip(0),
};

// Force skip to the end of the record, Record is 448 bytes
baseObj.skipToEnd = bp.skip(448 - Object.values(baseObj).reduce((p, c) => c.size + p, 0));

const ObjectParser = bp.object('Object', baseObj);

export type ObjectNode = StrutInfer<typeof ObjectParser>;

export const ObjectReader = bp.object('Levels', {
  count: bp.variable('count', bp.lu32),
  objects: bp.array('Level', ObjectParser, 'count'),
});
