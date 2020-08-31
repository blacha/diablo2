import { Diablo2GameSession } from '@diablo2/core';
import { NpcAssign } from '@diablo2/packets/build/packets-pod/server';
import * as c from 'ansi-colors';
import { Diablo2PacketSniffer } from '../sniffer';

/** Track all NPCs that are being reported */
export function sniffNpc(sniffer: Diablo2PacketSniffer): void {
  sniffer.onNewGame((game: Diablo2GameSession) => {
    game.parser.on(NpcAssign, (npc) => {
      const npcInfo = game.client.monsters.get(npc.code);
      const monsterName = npcInfo == null ? 'Unknown' : game.client.lang.get(npcInfo.name);
      console.log(c.red('Npc'), monsterName, `@ ${npc.x},${npc.y}`);
    });
  });
}
