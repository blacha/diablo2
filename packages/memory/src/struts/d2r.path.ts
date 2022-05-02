import { bp, StrutInfer } from 'binparse';
import { Pointer } from './pointer.js';
const { at, lu16, lu32 } = bp;

export const D2rPathStrut = bp.object('Path', {
  xOffset: at(0x00, lu16),
  x: at(0x02, lu16),
  yOffset: at(0x04, lu16),
  y: at(0x06, lu16),
  staticX: at(0x10, lu16),
  staticY: at(0x14, lu16),
  pRoom: at(0x20, new Pointer(lu32)),
});

D2rPathStrut.setSize(0x24);

export type PathS = StrutInfer<typeof D2rPathStrut>;
