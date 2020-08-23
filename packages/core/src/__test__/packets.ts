import 'source-map-support/register';

import * as fs from 'fs';
import * as path from 'path';
import { Diablo2GameClient } from '..';

const packetPath = path.join(__dirname, '..', '..', '..', '..', 'test-data', 'packets.json');

export const FullGamePackets: { data: number[] }[] = [];
if (fs.existsSync(packetPath)) {
  const morePackets = JSON.parse(fs.readFileSync(packetPath).toString());
  for (const pkt of morePackets) FullGamePackets.push(pkt);

  const client = new Diablo2GameClient();

  for (const pkt of FullGamePackets) {
    client.onPacketIn(pkt.data);
  }
}
