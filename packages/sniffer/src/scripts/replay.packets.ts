import { Diablo2MpqLoader } from '@diablo2/bintools';
import { Diablo2Client } from '@diablo2/core';
import { createReadStream, existsSync } from 'fs';
import * as readline from 'readline';
import { sniffItems } from '../example/item.tracker';
import { sniffNpc } from '../example/npc.tracker';
import { Log } from '../logger';

interface PacketLine {
  direction: 'in' | 'out';
  bytes: string;
}

async function main(): Promise<void> {
  const packetFile = process.argv.pop();
  if (packetFile == null || process.argv.length < 2 || !existsSync(packetFile)) {
    console.log('Usage: ./replay-packets :packetFile');
    return;
  }

  if (process.env['DIABLO2_PATH']) await Diablo2MpqLoader.load(process.env['DIABLO2_PATH'], Log);

  Log.info('Process Packets');

  const client = new Diablo2Client();
  const session = client.startSession(Log);

  sniffItems(session);
  sniffNpc(session);

  const reader = readline.createInterface({ input: createReadStream(packetFile), crlfDelay: Infinity });

  for await (const line of reader) {
    const json = JSON.parse(line) as PacketLine;
    session.onPacket(json.direction, Buffer.from(json.bytes, 'hex'));
  }

  console.log('Packets', session.parser.inPacketParsedCount);
}

main();
