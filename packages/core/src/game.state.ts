import { ulid } from 'ulid';
import { Diablo2Client } from './client';
import { Diablo2PacketParser } from './packet.parser';

export enum GameState {
  init,
  loading,
  active,
  finished,
}

export class Diablo2GameSession {
  id: string = ulid().toLowerCase();
  client: Diablo2Client;
  parser: Diablo2PacketParser;

  state = GameState.init;

  constructor(client: Diablo2Client) {
    this.client = client;
    this.parser = new Diablo2PacketParser(client);
    this.parser.events.on('*', (pkt) => console.log(pkt.packet.id, pkt.packet.name, { ...pkt, packet: undefined }));
  }

  close(): void {
    this.state = GameState.finished;
  }
}
