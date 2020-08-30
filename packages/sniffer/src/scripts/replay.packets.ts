import { Diablo2Client } from '@diablo2/core';
import { createReadStream, existsSync } from 'fs';
import * as readline from 'readline';

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

  const client = new Diablo2Client();
  const session = client.startSession(console);
  const reader = readline.createInterface({ input: createReadStream(packetFile), crlfDelay: Infinity });
  const lines = [];
  for await (const line of reader) {
    lines.push(line);
  }
  let index = 0;
  for (const x of lines) {
    const json = JSON.parse(x) as PacketLine;
    if (json.direction == 'out') continue;
    console.log(index++, json.bytes);
    session.onPacket(json.direction, Buffer.from(json.bytes, 'hex'));
  }
  console.log('Packets', session.parser.inPacketParsedCount);
}

main();
