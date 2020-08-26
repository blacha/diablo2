import { PacketsPod } from '@diablo2/packets/build/packets-pod';
import * as fs from 'fs';
import * as path from 'path';
import 'source-map-support/register';
import { Diablo2Client } from '../client';

const packetPath = path.join(__dirname, '..', '..', '..', '..', 'test-data', '2020-08-24T05:51-packets.json');

export const FullGamePackets: { seqno: number; direction: 'in' | 'out'; data: number[] }[] = [];
if (fs.existsSync(packetPath)) {
  const morePackets = JSON.parse(fs.readFileSync(packetPath).toString());
  for (const pkt of morePackets) FullGamePackets.push(pkt);

  FullGamePackets.sort((a, b) => a.seqno - b.seqno);

  const client = new Diablo2Client(PacketsPod);

  // client.on(WalkVerify, (pkt, index) => console.log(index, pkt.x, pkt.y));
  console.time('ParseAllPackets');

  const Streams = [];
  const packetsUsed = new Set();
  const packets = new Map();

  for (const pkt of FullGamePackets) {
    if (pkt.direction == 'out') continue;
    if (packets.has(pkt.seqno)) console.error('Dupe ' + pkt.seqno);
    packets.set(pkt.seqno, pkt);
  }

  while (true) {
    const firstStream = FullGamePackets.find((f) => f.direction == 'in' && !packetsUsed.has(f.seqno));
    if (firstStream == null) break;
    let expectedNext = firstStream.seqno;
    const currentStream = [];
    while (true) {
      const currentPacket = packets.get(expectedNext);
      if (currentPacket == null) break;
      packets.delete(expectedNext);
      currentStream.push(currentPacket);
      expectedNext = currentPacket.seqno + currentPacket.data.length;
      packetsUsed.add(currentPacket.seqno);
    }
    Streams.push(currentStream);
    // if (currentStream.length > 0) break;
    // console.log(currentStream.length);
    // break;
  }
  for (const stream of Streams) {
    const session = client.startSession();

    if (stream.length !== 14193) continue;
    console.log('StartStream', stream.length);

    for (const pkt of stream) {
      if (pkt.direction == 'in') {
        // console.log(pkt.seqno, pkt.data);
        session.parser.onPacketIn(pkt.data);
      } else {
        // console.log(pkt.direction);
        // client.onPacketOut(pkt.data);
      }
      // if (i > 5) break;
      // if (client.parser.clientToServer.count > 1) break;
    }
    // if (stream.length > 150) break;
  }

  console.timeEnd('ParseAllPackets');
}
