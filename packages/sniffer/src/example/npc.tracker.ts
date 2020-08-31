import { Diablo2GameSession } from '@diablo2/core';
import { PacketsPod } from '@diablo2/packets';
import * as c from 'ansi-colors';
import { Diablo2PacketSniffer } from '../sniffer';

/** Track all NPCs that are being reported */
export function sniffNpc(sniffer: Diablo2PacketSniffer): void {
  sniffer.onNewGame((game: Diablo2GameSession) => {
    const mpq = game.client.mpq;

    game.parser.on(PacketsPod.server.NpcAssign, (npc) => {
      const npcInfo = mpq.monsters.get(npc.code);
      const monsterName = mpq.t(npcInfo?.nameLangId, 'Unknown');
      console.log(c.red('Npc'), monsterName, `@ ${npc.x},${npc.y}`);
    });
  });
}
