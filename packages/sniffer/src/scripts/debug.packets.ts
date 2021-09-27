const DecompressedPacketData =
  '566137303539383563316261663938336430393139353861616161396231316237353330373861383533333833616136636466313537373038356537363833643200';

import { Diablo2MpqLoader } from '@diablo2/bintools';
import { Diablo2Client } from '@diablo2/core';
import { Diablo2Mpq, getDiabloVersion, toHex } from '@diablo2/data';
import 'source-map-support/register.js';
import { Log } from '../logger.js';

async function main(): Promise<void> {
  if (process.env['DIABLO2_PATH']) await Diablo2MpqLoader.load(process.env['DIABLO2_PATH'], Log, Diablo2Mpq);

  Log.info('Debug Packets');
  if (Diablo2Mpq.basePath == null) throw new Error('No $DIABLO2_PATH set');
  const version = getDiabloVersion(Diablo2Mpq.basePath);
  const client = new Diablo2Client(version);
  const session = client.startSession(Log);

  const packetData = Buffer.from(DecompressedPacketData, 'hex');
  console.log('PacketLength', { packet: toHex(packetData[0]), length: packetData.length });
  const packet = client.serverToClient.packets.get(packetData[0]);
  if (packet) {
    try {
      const pkt = packet.create(packetData);
      console.log(pkt.value, pkt.size === packetData.length);
    } catch (e) {
      console.log('FailedToParse', e.message);
    }
  }

  for (let i = 0; i < packetData.length; i++) {
    try {
      const packets = [];
      let offset = i;
      //   const res = session.parser.client.serverToClient.create(packetData, offset);
      //   offset += res.packet.size;
      while (offset < packetData.length) {
        const res = session.parser.client.serverToClient.create(packetData, offset);
        console.log(offset, res.packet.id.toString(16), res.packet.name);

        offset += res.packet.size;
        packets.push(res);

        if (packets.length > 10) break;
      }
      //   break;
      //   const data =  session.parser.onPacketIn(Buffer.from(RawPacketData, 'hex'), Log, 0, 25 + i);

      let sizeFound = false;

      for (let targetOffset = i; targetOffset > 0; targetOffset--) {
        const remainingLength = i - targetOffset;
        // if (remainingLength < 10) continue;
        // console.log(targetOffset, remainingLength);
        if (packetData[targetOffset] === remainingLength) {
          console.log(
            '\t\tPossibleSize@',
            { offset: targetOffset, remainingLength },
            packetData[targetOffset].toString(16),
          );
          sizeFound = true;
        }
        //         //   const target = i;
        //         //   if (packetData[target])
      }

      if (sizeFound) {
        console.log(
          '\tFoundPacket',
          i,
          i.toString(16),
          { target: i + 25 + 1 },
          // packets.map((c) => c.packet.name),
        );
      }
      if (i > 80) break;
      //   break;
    } catch (e) {
      continue;
    }
  }
}

main();
