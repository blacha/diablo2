import { Diablo2GameSession } from '@diablo2/core';
import { PacketsPod } from '@diablo2/packets';
import * as c from 'ansi-colors';
import { Diablo2PacketSniffer } from '../sniffer';

/** Track all NPCs that are being reported */
export function sniffNpc(sniffer: Diablo2PacketSniffer): void {
  sniffer.onNewGame((game: Diablo2GameSession) => {
    game.parser.on(PacketsPod.server.NpcAssign, (npc) => {
      if (npc.flags == null) return;
      console.log(c.red('Npc'), npc, `@ ${npc.x},${npc.y}`, npc.flags);
    });
  });
}
