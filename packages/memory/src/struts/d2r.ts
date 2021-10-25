import { bp } from 'binparse';
import { D2PathStrut, D2StatListStrut, D2StatStrut } from './common.js';
import { Pointer } from './pointer.js';

export const D2rWaypointData = bp.object('D2rWaypoint', {});
export const D2rQuestData = bp.object('D2rQuest', {});
export const D2rArenaUnit = bp.object('D2rArenaUnit', {});
export const D2rPlayerTrade = bp.object('D2rPlayerTrade', {});
export const D2rClient = bp.object('D2rClient', {});

export const D2rActMisc = bp.object('D2rActMisc', {
  tombLevel: bp.lu32,
  skip2: bp.skip(0x830 - 0x00 - 4),
  difficulty: bp.lu32, // 0x830??
});

export const D2rActStrut = bp.object('Act', {
  skip1: bp.skip(0x14),
  mapSeed: bp.lu32, // 0x14

  skip2: bp.skip(0x70 - 0x14 - 4),
  pActMisc: new Pointer(bp.lu32), // this is wrong
});

export const D2rPlayerDataStrut = bp.object('D2rPlayerData', {
  name: bp.string(16), // 0x00
  questNormal: new Pointer(D2rQuestData), // 0x10
  questNightmare: new Pointer(D2rQuestData), // 0x18
  questHell: new Pointer(D2rQuestData), // 0x20
  wpNormal: new Pointer(D2rWaypointData), // 0x28
  wpNightmare: new Pointer(D2rWaypointData), // 0x30
  wpHell: new Pointer(D2rWaypointData), // 0x38
  unk1: bp.skip(0x68 - (0x38 + 8)),
  arenaUnit: new Pointer(D2rArenaUnit), // 0x68
  unk2: bp.skip(0xc0 - (0x68 + 8)),
  playerTrade: new Pointer(D2rPlayerTrade), // 0xc0
  unk3: bp.skip(0x1d0 - (0xc0 + 8)),
  // unk3: bp.skip(0x268 - (0xc0 + 8)),
  client: new Pointer(D2rClient),
});

export const D2rUnitAnyPlayerStrut = bp.object('D2rUnitAnyPlayer', {
  type: bp.lu32, //  0x00
  txtFileNo: bp.lu32, // 0x04
  unitId: bp.lu32, // 0x08
  mode: bp.lu32, // 0x0c
  /** Pointer to PlayerStrut */
  pData: new Pointer(D2rPlayerDataStrut), //0x10
  actId: bp.lu32, // 0x18
  // New??
  unk1: bp.lu32, // 0x1c
  /** Pointer to Act */
  pAct: new Pointer(D2rActStrut), // 0x20
  seedA: bp.lu32, // 0x28
  seedB: bp.lu32, // 0x2c
  unk2: bp.array('Unk2', new Pointer(bp.lu32), 1), // 0x30
  pPath: new Pointer(D2PathStrut), // 0x38
  unk3: bp.skip(40), // x040
  unk4: bp.array('Unk4', new Pointer(bp.lu32), 4), // 0x068

  pStats: new Pointer(D2StatListStrut), // 0x88

  unk5: bp.array('Unk5', new Pointer(bp.lu32), 25),

  nextUnit: bp.lu64, // 0x158
});

export const D2rStrut = {
  UnitPlayer: D2rUnitAnyPlayerStrut,
  PlayerData: D2rPlayerDataStrut,
  StatList: D2StatListStrut,
  Stat: D2StatStrut,
  Act: D2rActStrut,
  ActMisc: D2rActMisc,
  Path: D2PathStrut,
};
