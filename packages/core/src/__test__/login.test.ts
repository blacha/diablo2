import { Diablo2Version } from '@diablo2/data';
import o from 'ospec';
import 'source-map-support/register';
import { Diablo2Client } from '../client';

const GamePackets = [
  { data: [175, 1] },
  { data: [6, 122, 4, 100, 187, 188] },
  { data: [7, 31, 127, 255, 255, 255, 192] },
  { data: [2, 92] },
];

o.spec('LoginTest', () => {
  o('should handle game init', () => {
    const client = new Diablo2Client(Diablo2Version.PathOfDiablo);
    const session = client.startSession(console);

    const allPackets: number[] = [];
    session.parser.all((pkt) => allPackets.push(pkt.packet.id));

    for (const pkt of GamePackets) {
      session.onPacket('in', Buffer.from(pkt.data), console);
    }

    o(allPackets).deepEquals([1, 143, 2]);
  });
});
