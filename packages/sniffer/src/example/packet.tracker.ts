import { Diablo2GameSession } from '@diablo2/core';
import { Log } from '../logger';

/** Track all packets that are being received */
export function sniffAll(game: Diablo2GameSession): void {
  game.parser.all((pkt) => {
    const { packet } = pkt;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete pkt.packet; // Remove the packet information to reduce logging information
    Log.debug({ pkt }, packet.name);
    pkt.packet = packet;
  });
}
