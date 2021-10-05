import { Attribute, toHex } from '@diablo2/data';
import { Diablo2Process } from './d2.js';
import { Pointer } from './index.js';
import { LogType } from './logger.js';
import { ActS, ActStrut, PathS, PathStrut, StatListStrut, StatStrut, UnitPlayer } from './structures.js';
import { D2RStrut } from './struts/d2r.js';

export class Diablo2Player {
  d2: Diablo2Process;
  offset: number;

  constructor(d2: Diablo2Process, offset: number) {
    this.offset = offset;
    this.d2 = d2;
  }

  async validate(log: LogType): Promise<UnitPlayer | null> {
    const player = await this.player;
    if (Pointer.isPointersValid(player) === 0) {
      log.warn(
        {
          unit: toHex(this.offset),
          act: toHex(player.pAct.offset),
          player: toHex(player.pPlayer.offset),
          path: toHex(player.pPath.offset),
        },
        'InvalidOffset',
      );
      return null;
    }
    return player;
  }

  get player(): Promise<UnitPlayer> {
    return this.d2.readStrutAt(this.offset, D2RStrut.UnitPlayer);
  }

  getStats(player: UnitPlayer, logger: LogType): Promise<Map<Attribute, number>> {
    return this.loadStats(player, logger);
  }

  async loadStats(player: UnitPlayer, logger: LogType): Promise<Map<Attribute, number>> {
    if (!player.pStats.isValid) logger.error({ offset: toHex(player.pStats.offset) }, 'Player:OffsetInvalid:Stats');
    const stats = new Map<Attribute, number>();

    const statList = await this.d2.readStrutAt(player.pStats.offset, StatListStrut);
    const buf = await this.d2.process.read(statList.pStat.offset, StatStrut.size * statList.count);

    for (let i = 0; i < statList.count; i++) {
      const stat = StatStrut.raw(buf, i * StatStrut.size);
      stats.set(stat.code, stat.value);
    }

    return stats;
  }

  getAct(player: UnitPlayer, logger: LogType): Promise<ActS> {
    if (!player.pAct.isValid) logger.error({ offset: toHex(player.pAct.offset) }, 'Player:OffsetInvalid:Act');
    return this.d2.readStrutAt(player.pAct.offset, ActStrut);
  }

  getPath(player: UnitPlayer, logger: LogType): Promise<PathS> {
    if (!player.pPath.isValid) logger.error({ offset: toHex(player.pPath.offset) }, 'Player:OffsetInvalid:Path');
    return this.d2.readStrutAt(player.pPath.offset, PathStrut);
  }
}
