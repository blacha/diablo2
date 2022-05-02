import { Diablo2State } from '@diablo2/core';
import { Attribute, Diablo2Mpq, UnitType } from '@diablo2/data';
import { bp } from 'binparse';
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

  mapSeed: number;

  constructor(proc: Diablo2Process, playerName: string) {
    this.d2 = proc;
    this.playerName = playerName;
    this.state = new Diablo2State(id, Log);
  }

  async start(logger: LogType): Promise<void> {
    logger.info({ d2Proc: this.d2.process.pid, player: this.playerName }, 'Session:Start');

    let errorCount = 0;
    while (true) {
      try {
        const player = await this.waitForPlayer(logger);
        if (player == null) continue;

        await this.updateState(player, logger);
        this.state.player.name = this.playerName;
        await sleep(this.tickSpeed);
        errorCount = 0;
      } catch (err) {
        logger.error({ d2Proc: this.d2.process.pid, err }, 'Session:Error');
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
      logger.info({ d2Proc: this.d2.process.pid, player: this.playerName }, 'Session:WaitForPlayer');

      await sleep(Math.min(backOff * 500, 5_000));
      backOff++;

      this.player = await this.d2.scanForPlayer(this.playerName, logger);
      if (this.player == null) continue;
      return this.player;
    }
  }

  async updateState(obj: Diablo2Player, logger: LogType): Promise<void> {
    const startTime = process.hrtime.bigint();
    const player = await obj.validate(logger);
    // Player object is no longer validate assume game has exited
    if (player == null) return;

    const path = await obj.getPath(player, logger);
    const act = await obj.getAct(player, logger);

    const mapSeed = await obj.d2.readStrutAt(this.mapSeed, bp.lu32);
    this.state.map.act = player.actId;

    // Track map information
    if (mapSeed !== this.state.map.id) {
      this.state.map.id = mapSeed;
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

    // Track Npcs
    const units = await obj.getNearBy(path, logger);
    // console.log({ units });
    for (const unit of units.values()) {
      if (unit.type.id === UnitType.NPC) {
        const monName = Diablo2Mpq.monsters.name(unit.txtFileNo);
        if (monName == null) continue;
        if (monName.includes('evil force')) continue;
        const stats = await obj.loadStats(unit, logger);

        const lifeCurrent = stats.get(Attribute.Life);
        const lifeMax = stats.get(Attribute.LifeMax);

        let lifePercent = 0;
        if (lifeCurrent && lifeMax) {
          lifePercent = (lifeCurrent / lifeMax) * 100;
        }

        if (isNaN(lifePercent) || lifePercent === 0) {
          if (this.state.units.delete(unit.unitId)) this.state.dirty();
          continue;
        }

        const loc = await unit.pPath.fetch(this.d2.process);
        if (this.state.units.has(unit.unitId)) {
          this.state.moveNpc(unit.unitId, loc.x, loc.y, lifePercent);
        } else {
          this.state.trackNpc({
            id: unit.unitId,
            type: 'npc',
            name: monName,
            x: loc.x,
            y: loc.y,
            code: unit.txtFileNo,
            life: lifePercent,
            flags: {},
            enchants: [],
            updatedAt: Date.now(),
          });
        }
      }
      // Noop
    }

    const duration = Number(process.hrtime.bigint() - startTime) / 1_000_000;

    if (duration > 10) logger.warn({ duration }, 'Update:Tick:Slow');
    else if (duration > 5) logger.info({ duration }, 'Update:Tick:Slow');
    else logger.trace({ duration }, 'Update:Tick');
    // console.log(this.state.units.size);
  }
}
