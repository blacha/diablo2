import { ItemQuality } from '@diablo2/data';
import { bp, StrutInfer } from 'binparse';
import { D2rActStrut } from './d2r.act.js';
import { D2rArenaUnit, D2rPlayerTrade, D2rQuestData, D2rStatListStrut, D2rWaypointData } from './d2r.js';
import { D2rPathStrut } from './d2r.path.js';
import { Pointer } from './pointer.js';

const { lu32, at, u8, lu64 } = bp;

export const D2rUnitDataPlayerStrut = bp.object('D2rUnitDataPlayerStrut', {
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
D2rUnitDataPlayerStrut.setSize(0x270);

export const PointerUnitDataPlayer = new Pointer(D2rUnitDataPlayerStrut);

export const D2rUnitDataNpcStrut = bp.object('D2rUnitDataNpcStrut', {
  flags: at(0x1a, u8),
});
D2rUnitDataNpcStrut.setSize(0x1b);

export const PointerUnitDataNpc = new Pointer(D2rUnitDataNpcStrut);

export const D2rUnitDataItemStrut = bp.object('D2rUnitDataItemStrut', {
  quality: at(0x00, u8),
  flags: at(0x18, u8),
  uniqueId: at(0x34, u8),
});
D2rUnitDataItemStrut.setSize(0x35);

export const PointerUnitDataItem = new Pointer(D2rUnitDataItemStrut);

export const D2rUnitStrut = bp.object('D2rUnitAny', {
  type: lu32, //  0x00
  txtFileNo: lu32, // 0x04
  unitId: lu32, // 0x08
  mode: lu32, // 0x0c
  /** Based off this.type this could be any of the D2rUnitData*Struts */
  pData: at(0x10, new Pointer(bp.u8)),
  actId: at(0x18, bp.lu32),
  pAct: at(0x20, new Pointer(D2rActStrut)),
  pPath: at(0x38, new Pointer(D2rPathStrut)),
  pStats: at(0x88, new Pointer(D2rStatListStrut)),
  pNext: at(0x150, lu64),
  pRoomNext: at(0x158, lu64), // pointer to self

  playerClass: at(0x174, bp.u8),
});

D2rUnitStrut.setSize(0x174);

export const PointerUnitAny = new Pointer(D2rUnitStrut);

export type UnitAnyS = StrutInfer<typeof D2rUnitStrut>;
