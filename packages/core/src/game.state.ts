import { Logger } from '@diablo2/bintools';
import { ulid } from 'ulid';
import { Diablo2Client } from './client';
import { Diablo2PacketParser } from './packet.parser';

export class Diablo2GameSession {
  id: string = ulid().toLowerCase();
  client: Diablo2Client;
  parser: Diablo2PacketParser;

  log: Logger;

  constructor(client: Diablo2Client, log: Logger) {
    this.log = log;
    this.client = client;
    this.parser = new Diablo2PacketParser(client);
  }

  onPacket(direction: 'in' | 'out', bytes: Buffer): void {
    if (direction == 'in') return this.parser.onPacketIn(bytes);
    return this.parser.onPacketOut(bytes);
  }
}
