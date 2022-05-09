import { bp, StrutInfer } from 'binparse';
import { D2rRoomStrut } from './d2r.room.js';
import { Pointer } from './pointer.js';

const { at, lu16 } = bp;

export const D2rPathStrut = bp.object('Path', {
  xOffset: at(0x00, lu16),
  x: at(0x02, lu16),
  yOffset: at(0x04, lu16),
  y: at(0x06, lu16),
  staticX: at(0x10, lu16),
  staticY: at(0x14, lu16),
  pRoom: at(0x20, new Pointer(D2rRoomStrut)),
});
D2rPathStrut.setSize(0x28);

export type PathS = StrutInfer<typeof D2rPathStrut>;
