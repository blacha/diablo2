import { bp, StrutInfer } from 'binparse';
import { Pointer } from './pointer.js';
const { at, lu32, u8 } = bp;

export const D2rRoomStrut = bp.object('Room', {
  pRoomNear: at(0x00, new Pointer(u8)),
  pRoomExt: at(0x18, new Pointer(u8)),
  roomNearCount: at(0x40, lu32),
  pAct: at(0x48, new Pointer(u8)),
  pUnitFirst: at(0xa8, new Pointer(u8)),
  pRoomNext: at(0xb0, new Pointer(u8)),
});

D2rRoomStrut.setSize(0xb8);

export const RoomPointer = new Pointer(D2rRoomStrut);

export type RoomS = StrutInfer<typeof D2rRoomStrut>;
