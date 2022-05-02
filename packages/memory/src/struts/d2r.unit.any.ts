import { bp, StrutInfer } from 'binparse';
import { D2rPlayerDataStrut, D2rActStrut, D2rStatListStrut } from './d2r.js';
import { D2rPathStrut } from './d2r.path.js';
import { Pointer } from './pointer.js';

export const D2rUnitAnyStrut = bp.object('D2rUnitAny', {
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
  pPath: new Pointer(D2rPathStrut), // 0x38
  unk3: bp.skip(40), // x040
  unk4: bp.array('Unk4', new Pointer(bp.lu32), 4), // 0x068

  pStats: new Pointer(D2rStatListStrut), // 0x88

  unk5: bp.array('Unk5', new Pointer(bp.lu32), 25 /* 25 */),
  // pSomething: new Pointer(D2rUnk),

  // nextUnit: bp.lu64, // 0x158
});

export type UnitAnyS = StrutInfer<typeof D2rUnitAnyStrut>;
