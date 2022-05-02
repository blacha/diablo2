import { Attribute, Difficulty, toHex } from '@diablo2/data';
import { Diablo2Process } from './d2.js';
import { Pointer } from './index.js';
import { LogType } from './logger.js';
// import { UnitPlayer } from './structures.js';
import { ActS, D2rActMiscStrut, D2rActStrut, D2rStatListStrut, D2rStatStrut } from './struts/d2r.js';
import { D2rPathStrut, PathS } from './struts/d2r.path.js';
import { D2rUnitAnyStrut, UnitAnyS } from './struts/d2r.unit.any.js';

export class Diablo2Player {
  d2: Diablo2Process;
  offset: number;

  constructor(d2: Diablo2Process, offset: number) {
    this.offset = offset;
    this.d2 = d2;
  }

  async validate(log: LogType): Promise<UnitAnyS | null> {
    const player = await this.player;
    if (Pointer.isPointersValid(player) === 0) {
      log.warn(
        {
          unit: toHex(this.offset),
          act: toHex(player.pAct.offset),
          player: toHex(player.pData.offset),
          path: toHex(player.pPath.offset),
        },
        'InvalidOffset',
      );
      return null;
    }
    return player;
  }

  get player(): Promise<UnitAnyS> {
    return this.d2.readStrutAt(this.offset, D2rUnitAnyStrut);
  }

  getStats(player: UnitAnyS, logger: LogType): Promise<Map<Attribute, number>> {
    return this.loadStats(player, logger);
  }

  async loadStats(player: UnitAnyS, logger: LogType): Promise<Map<Attribute, number>> {
    if (!player.pStats.isValid) logger.error({ offset: toHex(player.pStats.offset) }, 'Player:OffsetInvalid:Stats');
    const stats = new Map<Attribute, number>();

    const statList = await this.d2.readStrutAt(player.pStats.offset, D2rStatListStrut);
    const buf = await this.d2.process.read(statList.pStats.offset, D2rStatStrut.size * statList.count);

    for (let i = 0; i < statList.count; i++) {
      const stat = D2rStatStrut.raw(buf, i * D2rStatStrut.size);
      stats.set(stat.code, stat.value);
    }

    return stats;
  }

  async getAct(player: UnitAnyS, logger: LogType): Promise<ActS> {
    if (!player.pAct.isValid) logger.error({ offset: toHex(player.pAct.offset) }, 'Player:OffsetInvalid:Act');
    const act = await this.d2.readStrutAt(player.pAct.offset, D2rActStrut);
    return act;
  }

  getPath(player: UnitAnyS, logger: LogType): Promise<PathS> {
    if (!player.pPath.isValid) logger.error({ offset: toHex(player.pPath.offset) }, 'Player:OffsetInvalid:Path');
    return this.d2.readStrutAt(player.pPath.offset, D2rPathStrut);
  }

  async getDifficulty(act: ActS, logger: LogType): Promise<Difficulty> {
    if (!act.pActMisc.isValid) {
      logger.error({ offset: toHex(act.pActMisc.offset) }, 'Player:OffsetInvalid:Difficulty');
      if (process.argv.includes('--nightmare')) return Difficulty.Nightmare;
      if (process.argv.includes('--normal')) return Difficulty.Normal;
      return Difficulty.Hell;
    }

    const actMisc = await this.d2.readStrutAt(act.pActMisc.offset, D2rActMiscStrut);
    return actMisc.difficulty;
  }
}
