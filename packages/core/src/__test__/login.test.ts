import 'source-map-support/register';

import o from 'ospec';
import { Diablo2GameClient } from '../index';

const GamePackets = [
  { time: '2020-08-20T08:07:24.389Z', seqno: 1841754103, data: [175, 1] },
  { time: '2020-08-20T08:07:24.441Z', seqno: 1841754105, data: [6, 122, 4, 100, 187, 188] },
  { time: '2020-08-20T08:07:24.595Z', seqno: 1841754111, data: [7, 31, 127, 255, 255, 255, 192] },
  { time: '2020-08-20T08:07:24.877Z', seqno: 1841754118, data: [2, 92] },
  //   },
];

o.spec('LoginTest', () => {
  // o('should login', () => {
  //     const client = new Diablo2GameClient();

  //     client.onPacketIn([175, 1])
  //     client.onPacketIn([6, 122, 4, 100, 187, 188])
  //     client.onPacketIn([7, 31, 127, 255, 255, 255, 192])
  //     client.onPacketIn([2, 92]);
  // })

  o('should handle full game init', () => {
    const client = new Diablo2GameClient();

    for (const pkt of GamePackets) {
      client.onPacketIn(pkt.data);
    }
  });
});

o.run();
