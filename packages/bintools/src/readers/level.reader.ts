import { bp, StrutInfer } from 'binparse';

const baseObj = {
  id: bp.lu16,
  pallette: bp.u8,
  act: bp.u8,
  isTeleportEnabled: bp.u8.refine((r) => r === 1),
  isRaining: bp.u8.refine((r) => r === 1),
  mud: bp.u8,
  noPer: bp.u8,
  isInside: bp.u8,

  skip2: bp.skip(0xf5 - 9),
  name: bp.string(40),
  warp: bp.string(40),
  //   entryFile: bp.string(40),
  skipToEnd: bp.skip(0),
};

// Force skip to the end of the record, Record is 544 bytes
baseObj.skipToEnd = bp.skip(544 - Object.values(baseObj).reduce((p, c) => c.size + p, 0));

const LevelParser = bp.object('Level', baseObj);

export type LevelNode = StrutInfer<typeof LevelParser>;

export const LevelReader = bp.object('Levels', {
  count: bp.lu32,
  levels: bp.array('Level', LevelParser, 'count'),
});
