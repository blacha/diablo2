import { Diablo2PacketFactory } from '@diablo2/packets';
import { PacketsPod } from '@diablo2/packets/build/packets-pod';
import { Diablo2GameSession } from './game.state';
import { Logger } from './log.interface';
import { Diablo2MpqLang, Diablo2MpqMonsters, loadLangFiles, loadMonsterFiles } from './mpq/mpq.loader';

export class Diablo2Client {
  lang: Diablo2MpqLang;
  monsters: Diablo2MpqMonsters;

  clientToServer = new Diablo2PacketFactory();
  serverToClient = new Diablo2PacketFactory();

  constructor() {
    for (const packet of Object.values(PacketsPod.client)) this.clientToServer.register(packet);
    for (const packet of Object.values(PacketsPod.server)) this.serverToClient.register(packet);
  }

  async init(path: string, logger: Logger): Promise<void> {
    logger.info({ path }, 'Reading game data');
    this.lang = await loadLangFiles(path, logger);
    this.monsters = await loadMonsterFiles(path, this.lang, logger);
  }

  startSession(log: Logger): Diablo2GameSession {
    return new Diablo2GameSession(this, log);
  }
}
