import { Diablo2GameSession } from '@diablo2/core';
import { ItemActionType, ItemQuality } from '@diablo2/data';
import { PacketsPod } from '@diablo2/packets';
import * as c from 'ansi-colors';
import { Diablo2PacketSniffer } from '../sniffer';

/** Track all items dropped onto the ground */
export function sniffItems(sniffer: Diablo2PacketSniffer): void {
  sniffer.onNewGame((game: Diablo2GameSession) => {
    const mpq = game.client.mpq;
    game.parser.on(PacketsPod.server.ItemActionWorld, (pkt) => {
      // Ignore items being moved around
      if (pkt.action.id !== ItemActionType.AddToGround) return;
      // Ignore gold
      if (pkt.code == 'gld') return;
      // Ignore things like scrolls/ health potion
      if (pkt.flags.isSimpleItem) return;

      const obj = JSON.parse(JSON.stringify({ sockets: pkt.sockets, quality: pkt.quality?.name, def: pkt.defense }));
      switch (pkt.quality.id) {
        case ItemQuality.Inferior:
        case ItemQuality.Normal:
        case ItemQuality.Superior:
        case ItemQuality.Magic:
        case ItemQuality.Rare:
          console.log(pkt.code, mpq.t(pkt.code), obj);
          break;
        case ItemQuality.Set:
          console.log(c.green(pkt.code), mpq.t(pkt.code), obj);
          break;
        case ItemQuality.Unique:
          console.log(c.yellow(pkt.code), mpq.t(pkt.code), obj);
          break;
      }
    });
  });
}
