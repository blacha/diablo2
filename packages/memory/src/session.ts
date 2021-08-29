import { Diablo2State } from '@diablo2/core';
import { Attribute, Difficulty } from '@diablo2/data';
import { Diablo2Player, Diablo2Process } from './d2';
import { id, Log, LogType } from './logger';

export class Diablo2GameSessionMemory {
  state: Diablo2State;
  d2: Diablo2Process;
  playerName: string;

  private _watcher: NodeJS.Timeout;

  constructor(proc: Diablo2Process, playerName: string) {
    this.d2 = proc;
    this.playerName = playerName;
    this.state = new Diablo2State(id, Log);
  }

  async start(log: LogType): Promise<void> {
    log.info({ pid: this.d2.process.pid }, 'StartSession');
    this.waitForPlayer();
  }

  async waitForPlayer(): Promise<void> {
    let backOff = 0;
    while (true) {
      const player = await this.d2.scanForPlayer(this.playerName);
      if (player == null) {
        await new Promise((r) => setTimeout(r, backOff));
        backOff += 500;
        backOff = Math.min(backOff, 2_500);
        continue;
      }
      await player.validate(this.state.log);

      if (this._watcher) clearInterval(this._watcher);
      this._watcher = setInterval(() => this.watchPlayer(player), 500);
      break;
    }
  }

  async watchPlayer(obj: Diablo2Player): Promise<void> {
    const startTime = Date.now();
    const player = await obj.validate(this.state.log);
    if (player == null) {
      clearInterval(this._watcher);
      this.waitForPlayer();
      return;
    }

    const path = await obj.path;
    const act = await obj.act;
    this.state.map.act = player.actId;

    if (act.mapSeed !== this.state.map.id) {
      this.state.map.id = act.mapSeed;
      this.state.map.difficulty = Difficulty.Normal;
      this.state.log.info({ map: this.state.map }, 'MapSeed:Changed');
    }

    if (this.state.players.get(player.unitId) == null) {
      this.state.addPlayer(player.unitId, 'Player', path.x, path.y);
    } else {
      this.state.movePlayer(undefined, player.unitId, path.x, path.y);
    }

    const stats = await obj.stats;
    const xp = stats.get(Attribute.Experience);

    if (xp != null && this.state.player.xp.current != xp) {
      this.state.trackXp(xp, true);
    }

    const duration = Date.now() - startTime;

    this.state.log.debug({ duration }, 'Update:Tick');
  }
}
