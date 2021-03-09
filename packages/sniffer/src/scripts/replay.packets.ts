import { Diablo2MpqLoader } from '@diablo2/bintools';
import { Diablo2Client } from '@diablo2/core';
import { Diablo2Mpq, getDiabloVersion } from '@diablo2/data';
import { createReadStream, existsSync } from 'fs';
import * as readline from 'readline';
import { SniffExample } from '../example/index';
import { Log } from '../logger';
import { PacketLine } from '../packet.line';

async function main(): Promise<void> {
  const packetFile = process.argv.pop();
  if (packetFile == null || process.argv.length < 2 || !existsSync(packetFile)) {
    console.log('Usage: ./replay-packets :packetFile');
    return;
  }

  if (process.env['DIABLO2_PATH']) await Diablo2MpqLoader.load(process.env['DIABLO2_PATH'], Log, Diablo2Mpq);

  Log.info('Process Packets');

  if (Diablo2Mpq.basePath == null) throw new Error('No $DIABLO2_PATH set');
  const version = getDiabloVersion(Diablo2Mpq.basePath);
  const client = new Diablo2Client(version);
  const session = client.startSession(Log);

  SniffExample.item(session);
  SniffExample.npc(session);

  const PacketByName = new Map<string, number>();
  session.parser.all((pkt) => {
    const pktName = pkt.packet.direction + ':' + pkt.packet.name;
    PacketByName.set(pktName, (PacketByName.get(pktName) ?? 0) + 1);
  });

  const reader = readline.createInterface({ input: createReadStream(packetFile), crlfDelay: Infinity });

  for await (const line of reader) {
    const json = JSON.parse(line) as PacketLine;
    // if (json.direction ===  'out') continue;
    session.onPacket(json.direction, Buffer.from(json.bytes, 'hex'), Log);
  }

  // for (const unit of session.state.units.values()) {
  //   if (unit.type === 'player') console.log(unit);
  // }
  // console.log(session.state.player);
  Log.info({ packetsIn: session.parser.inPacketParsedCount, packetsOut: session.parser.outPacketParsedCount }, 'Done');

  if (process.argv.includes('--stats')) {
    const packetStats = [...PacketByName.entries()].sort((a, b) => b[1] - a[1]);
    Log.debug('PacketStats');
    for (const [pktName, count] of packetStats) {
      Log.debug({ count }, pktName);
    }
  }
}

main();
