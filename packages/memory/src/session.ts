import { Diablo2State } from '@diablo2/core';
import { Attribute } from '@diablo2/data';
import { Diablo2Process } from './d2.js';
import { Diablo2Player } from './d2.player.js';
import { id, Log, LogType } from './logger.js';

const sleep = (dur: number): Promise<void> => new Promise((r) => setTimeout(r, dur));

export class Diablo2GameSessionMemory {
  state: Diablo2State;
  d2: Diablo2Process;
  playerName: string;

  player: Diablo2Player | null;
  /** Delay to wait between ticks */
  tickSpeed = 250;

  constructor(proc: Diablo2Process, playerName: string) {
    this.d2 = proc;
    this.playerName = playerName;
    this.state = new Diablo2State(id, Log);
  }

  async start(logger: LogType): Promise<void> {
    logger.info({ pid: this.d2.process.pid }, 'Session:Start');

    let errorCount = 0;
    while (true) {
      try {
        const player = await this.waitForPlayer(logger);
        if (player == null) continue;

        await this.updateState(player, logger);
        await sleep(this.tickSpeed);
        errorCount = 0;
      } catch (err) {
        logger.error({ pid: this.d2.process.pid, err }, 'Session:Error');
        errorCount++;
        await sleep(this.tickSpeed * errorCount);
        if (errorCount > 5) break;
      }
    }
  }

  async waitForPlayer(logger: LogType): Promise<Diablo2Player> {
    if (this.player) {
      const player = await this.player.validate(logger);
      if (player != null) return this.player;
    }
    this.player = null;
    let backOff = 0;
    while (true) {
      logger.info({ pid: this.d2.process.pid }, 'Session:WaitForPlayer');

      await sleep(Math.min(backOff * 500, 5_000));
      backOff++;

      this.player = await this.d2.scanForPlayer(this.playerName, logger);
      if (this.player == null) continue;
      return this.player;
    }
  }

  async updateState(obj: Diablo2Player, logger: LogType): Promise<void> {
    const startTime = Date.now();
    const player = await obj.validate(logger);
    // Player object is no longer validate assume game has exited
    if (player == null) return;

    const path = await obj.getPath(player, logger);
    const act = await obj.getAct(player, logger);
    this.state.map.act = player.actId;

    // Track map information
    if (act.mapSeed !== this.state.map.id) {
      this.state.map.id = act.mapSeed;
      this.state.map.difficulty = await obj.getDifficulty(act, logger);
      this.state.log.info({ map: this.state.map }, 'MapSeed:Changed');
    }

    // Track player location
    if (this.state.players.get(player.unitId) == null) {
      this.state.addPlayer(player.unitId, 'Player', path.x, path.y);
    } else {
      this.state.movePlayer(undefined, player.unitId, path.x, path.y);
    }

    // Track XP
    const stats = await obj.getStats(player, logger);
    const xp = stats.get(Attribute.Experience);
    if (xp != null && this.state.player.xp.current !== xp) {
      this.state.trackXp(xp, true);
    }

    const duration = Date.now() - startTime;

    if (duration > 100) logger.warn({ duration }, 'Update:Tick');
    else logger.trace({ duration }, 'Update:Tick');
  }
}
