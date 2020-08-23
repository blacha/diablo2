import 'source-map-support/register';

import o from 'ospec';
import { Diablo2GameClient } from '../index';
import { FullGamePackets } from './packets';

// const GamePackets = [
//   { data: [175, 1] },
//   { data: [6, 122, 4, 100, 187, 188] },
//   { data: [7, 31, 127, 255, 255, 255, 192] },
//   { data: [2, 92] },
// ];

o.spec('LoginTest', () => {
  // o('should handle game init', () => {
  //   const client = new Diablo2GameClient();
  //   for (const pkt of GamePackets) {
  //     client.onPacketIn(pkt.data);
  //   }
  // })
  o('should handle full game init', () => {
    const client = new Diablo2GameClient();

    for (const pkt of FullGamePackets) {
      client.onPacketIn(pkt.data);
    }
  });
});
