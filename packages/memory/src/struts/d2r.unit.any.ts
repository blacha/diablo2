import { UnitType } from '@diablo2/data';
import { bp, StrutInfer } from 'binparse';
import { D2rActStrut, D2rPlayerDataStrut, D2rStatListStrut } from './d2r.js';
import { D2rPathStrut } from './d2r.path.js';
import { Pointer } from './pointer.js';

const { lu32, at, u8, lu64 } = bp;

export const D2rUnitAnyStrut = bp.object('D2rUnitAny', {
  type: lu32.refine((r) => ({ id: r, type: UnitType[r] })), //  0x00
  txtFileNo: lu32, // 0x04
  unitId: lu32, // 0x08
  mode: lu32, // 0x0c
  pData: at(0x10, new Pointer(D2rPlayerDataStrut)),
  actId: at(0x18, bp.lu32),
  pAct: at(0x20, new Pointer(D2rActStrut)),
  pPath: at(0x38, new Pointer(D2rPathStrut)),
  pStats: at(0x88, new Pointer(D2rStatListStrut)),
  pNext: at(0x150, lu64),
  pRoomNext: at(0x158, lu64), // pointer to self

  playerClass: at(0x174, bp.u8),
});

D2rUnitAnyStrut.setSize(0x174);

export const PointerUnitAny = new Pointer(D2rUnitAnyStrut);

export type UnitAnyS = StrutInfer<typeof D2rUnitAnyStrut>;
