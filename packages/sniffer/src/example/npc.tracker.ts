import { Diablo2GameSession } from '@diablo2/core';
import { PacketsPod } from '@diablo2/packets';
import { Log } from '../logger.js';

/** Track all NPCs that are being reported */
export function sniffNpc(game: Diablo2GameSession): void {
  game.parser.on(PacketsPod.server.NpcAssign, (npc) => {
    if (npc.isNormal) return;
    Log.debug({ npc: npc.name, code: npc.code, x: npc.x, y: npc.y }, 'Npc');
  });
}
