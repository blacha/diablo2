import { ItemActionType, ItemQuality } from '@diablo2/data';
import * as P from '@diablo2/packets/build/packets-pod/server';
import { ulid } from 'ulid';
import { Diablo2Client } from './client';
import { Logger } from './log.interface';
import { Diablo2PacketParser } from './packet.parser';
import * as c from 'ansi-colors';

export class Diablo2GameSession {
  id: string = ulid().toLowerCase();
  client: Diablo2Client;
  parser: Diablo2PacketParser;

  log: Logger;

  constructor(client: Diablo2Client, log: Logger) {
    this.log = log;
    this.client = client;
    this.parser = new Diablo2PacketParser(client);
    // this.parser.events.on('*', (pkt) => {
    //   // if (PacketIgnore.has(pkt.packet.id)) return;
    //   // if (PacketTrace.has(pkt.packet.id)) return console.log(pkt);
    //   // console.log(pkt, pkt.packet.name);
    // });

    this.parser.on(P.ItemActionWorld, (pkt) => {
      if (pkt.action.id == ItemActionType.AddToGround) {
        if (pkt.code == 'gld') return;
        if (pkt.flags.isSimpleItem) return;

        const obj = JSON.parse(JSON.stringify({ sockets: pkt.sockets, quality: pkt.quality?.name, def: pkt.defense }));
        switch (pkt.quality.id) {
          case ItemQuality.Inferior:
          case ItemQuality.Normal:
          case ItemQuality.Superior:
          case ItemQuality.Magic:
          case ItemQuality.Rare:
            console.log(pkt.code, client.lang.get(pkt.code), obj);
            break;
          case ItemQuality.Set:
            console.log(c.green(pkt.code), client.lang.get(pkt.code), obj);
            break;
          case ItemQuality.Unique:
            console.log(c.yellow(pkt.code), client.lang.get(pkt.code), obj);
            break;
        }
      } else {
        // console.log(pkt);
      }
    });
  }

  onPacket(direction: 'in' | 'out', bytes: Buffer): void {
    if (direction == 'in') return this.parser.onPacketIn(bytes);
  }
}
