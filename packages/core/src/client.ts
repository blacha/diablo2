import { Diablo2Mpq, Logger } from '@diablo2/bintools';
import { Diablo2PacketFactory } from '@diablo2/packets';
import { PacketsPod } from '@diablo2/packets/build/packets-pod';
import { Diablo2GameSession } from './game.state';

export class Diablo2Client {
  mpq: Diablo2Mpq;

  clientToServer = new Diablo2PacketFactory();
  serverToClient = new Diablo2PacketFactory();

  constructor() {
    for (const packet of Object.values(PacketsPod.client)) this.clientToServer.register(packet);
    for (const packet of Object.values(PacketsPod.server)) this.serverToClient.register(packet);
  }

  async init(path: string, logger: Logger): Promise<void> {
    logger.info({ path }, 'Reading game data');

    this.mpq = new Diablo2Mpq(path);
    await this.mpq.init(logger);
  }

  startSession(log: Logger): Diablo2GameSession {
    return new Diablo2GameSession(this, log);
  }
}
