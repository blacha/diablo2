import 'source-map-support/register';

import * as fs from 'fs';
import * as path from 'path';
import { Diablo2GameClient } from '..';
import { WalkVerify } from '@diablo2/packets/build/server-pod';

const packetPath = path.join(__dirname, '..', '..', '..', '..', 'test-data', '2020-08-23T11:19-packets.json');

export const FullGamePackets: { data: number[] }[] = [];
if (fs.existsSync(packetPath)) {
  const morePackets = JSON.parse(fs.readFileSync(packetPath).toString());
  for (const pkt of morePackets) FullGamePackets.push(pkt);

  const client = new Diablo2GameClient();

  client.on(WalkVerify, (pkt, index) => console.log(index, pkt.x, pkt.y));
  console.time('ParseAllPackets');

  for (const pkt of FullGamePackets) {
    client.onPacketIn(pkt.data);
  }
  console.timeEnd('ParseAllPackets');
}
