import { bp, StrutInfer } from 'binparse';
import { Pointer } from './pointer.js';

const { at, lu32, u8, lu16 } = bp;

export const D2rWaypointData = bp.object('D2rWaypoint', {});
export const D2rQuestData = bp.object('D2rQuest', {});
export const D2rArenaUnit = bp.object('D2rArenaUnit', {});
export const D2rPlayerTrade = bp.object('D2rPlayerTrade', {});
export const D2rClient = bp.object('D2rClient', {});

export const D2rActMiscStrut = bp.object('D2rActMisc', {
  tombLevel: at(0x120, lu32),
  difficulty: at(0x830, lu16),
  pAct: at(0x858, new Pointer(u8)),
  pLevelFirst: at(0x868, new Pointer(u8)),
});
D2rActMiscStrut.setSize(0x870);
export type ActMiscS = StrutInfer<typeof D2rActMiscStrut>;

export const D2rActStrut = bp.object('Act', {
  // mapSeed: at(0x1c, lu32), // This has been moved
  // unk1: at(0x08, new Pointer(bp.u8)),
  actId: at(0x28, lu32),
  pActMisc: at(0x78, new Pointer(D2rActMiscStrut)), // this is wrong
});
D2rActStrut.setSize(0x80);
export type ActS = StrutInfer<typeof D2rActStrut>;

export const D2rPlayerDataStrut = bp.object('D2rPlayerData', {
  name: bp.string(0x40), // 0x00
  questNormal: new Pointer(D2rQuestData), // 0x40
  questNightmare: new Pointer(D2rQuestData), // 0x48
  questHell: new Pointer(D2rQuestData), // 0x50
  wpNormal: new Pointer(D2rWaypointData), // 0x58
  wpNightmare: new Pointer(D2rWaypointData), // 0x60
  wpHell: new Pointer(D2rWaypointData), // 0x68
  unk1: bp.skip(0x68 - (0x38 + 8)),
  arenaUnit: new Pointer(D2rArenaUnit), // 0x68
  unk2: bp.skip(0xc0 - (0x68 + 8)),
  playerTrade: new Pointer(D2rPlayerTrade), // 0xc0
  // unk3: bp.skip(0x1d0 - (0xc0 + 8)),
  // unk3: bp.skip(0x268 - (0xc0 + 8)),
  // client: at(0x208, new Pointer(D2rClient)),
});
D2rPlayerDataStrut.setSize(0x270);

export const D2rUnk = bp.object('D2rUnk', {});

export const D2rStatStrut = bp.object('D2StatStrut', {
  unk1: bp.lu16,
  code: bp.lu16,
  value: bp.lu32,
});
export type StatS = StrutInfer<typeof D2rStatStrut>;

export const D2rStatListStrut = bp.object('D2StatListStrut', {
  pStats: at(0x30, new Pointer(D2rStatStrut)),
  count: bp.lu16,
  countB: bp.lu16,
});
D2rStatListStrut.setSize(0x3c);
export type StatListS = StrutInfer<typeof D2rStatListStrut>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type PointerS<T = unknown> = { offset: number; isValid: boolean };
