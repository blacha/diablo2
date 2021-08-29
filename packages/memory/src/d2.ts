import { bp, StrutAny, StrutInfer, toHex } from 'binparse';
import pino from 'pino';
import { PrettyTransform } from 'pretty-json-log';
import 'source-map-support/register';
import { ulid } from 'ulid';
import { LogType } from './logger';
import { Process } from './process';
import { Scanner } from './scanner';
import { Act, ActStrut, Path, PathStrut, PlayerStrut, UnitAnyPlayerStrut, UnitPlayer } from './structures';
import { dump } from './util/dump';

const pinoLogger = process.stdout.isTTY ? pino(PrettyTransform.stream()) : pino();
export const logger = pinoLogger.child({ id: ulid().toLowerCase() });
logger.level = 'debug';

export class Diablo2Process {
  process: Process;
  /** Size of pointers */
  pointer = bp.lu32;

  constructor(proc: Process) {
    this.process = proc;
  }

  async readStrutAt<T extends StrutAny>(offset: number, strut: T, size = strut.size): Promise<StrutInfer<T>> {
    const buf = await this.process.memory(offset, size);
    return strut.raw(buf);
  }

  static async find(game: string | number = 'Game.exe'): Promise<Diablo2Process> {
    if (typeof game === 'number') return new Diablo2Process(new Process(game));
    const pid = await Process.findPidByName(game);
    if (pid == null) throw new Error('Unable to find "Game.exe"');
    return new Diablo2Process(new Process(pid));
  }

  async scanForGame(gameName: string): Promise<number | null> {
    console.log({ gameName });
    const gameOffsets = await Scanner.text(this.process, gameName);

    for (const offset of gameOffsets) {
      logger.info({ offset: toHex(offset) }, 'GameOffset');
      const memory = await this.process.memory(offset, 100);
      dump(memory);
    }

    console.log(gameOffsets);

    return null;
  }

  async scanForPlayer(playerName: string): Promise<Diablo2Player | null> {
    // Find all references to the player name
    logger.info({ process: this.process.pid, playerName }, 'StartScan');
    const playerNameOffsets = await Scanner.textFixed(this.process, playerName, 16);
    logger.info({ process: this.process.pid, playerName, offsets: playerNameOffsets.length }, 'NameOffsets');

    // Look for objects that look like the PlayerStrut object
    const goodOffsets: number[] = [];
    for (const offset of playerNameOffsets) {
      const strut = await this.readStrutAt(offset, PlayerStrut);
      if (!this.process.isValidOffset(strut.waypoint.normal)) continue;
      if (!this.process.isValidOffset(strut.waypoint.nightmare)) continue;
      if (!this.process.isValidOffset(strut.waypoint.hell)) continue;

      if (!this.process.isValidOffset(strut.quest.normal)) continue;
      if (!this.process.isValidOffset(strut.quest.nightmare)) continue;
      if (!this.process.isValidOffset(strut.quest.hell)) continue;
      logger.debug({ offset: toHex(offset), player: strut }, 'FoundOffset');
      goodOffsets.push(offset);
    }

    if (goodOffsets.length === 0) {
      logger.error({}, 'Unable to find player information');
      return null;
    }

    // Find pointers to the player strut and see if any look like the Act object
    const res = await this.scanForPlayerUnit(goodOffsets);

    if (res == null) {
      logger.error('Unable to find player information');
      return null;
    }

    const player = await res.player;
    const act = await res.act;
    logger.info({ offset: toHex(player.pAct.offset), mapSeed: act.mapSeed }, 'MapSeed');

    const path = await res.path;
    logger.info({ offset: toHex(player.pPath.offset), path: path }, 'Path');

    return res;
  }

  async scanForPlayerUnit(offsets: number[]): Promise<Diablo2Player | null> {
    for await (const { buffer, offset } of this.process.scan()) {
      for (let i = 0; i < buffer.length - this.pointer.size; i++) {
        const val = this.pointer.raw(buffer, i);

        for (const off of offsets) {
          if (val !== off) continue;
          const unitAny = UnitAnyPlayerStrut.raw(buffer, i - 16);

          // Unit should be a player
          if (unitAny.type !== 1) continue;

          if (unitAny.pAct.offset === 0) continue;
          logger.info({ offset: toHex(offset + i), player: unitAny, from: toHex(off) }, 'FoundPlayer');
          // TODO should we break early?

          return new Diablo2Player(this, offset + i - 16);
        }
      }
    }
    return null;
  }
}

export class Diablo2Player {
  d2: Diablo2Process;
  offset: number;
  constructor(d2: Diablo2Process, offset: number) {
    this.offset = offset;
    this.d2 = d2;
  }
  async validate(log: LogType): Promise<UnitPlayer | null> {
    const player = await this.player;

    if (
      !this.d2.process.isValidOffset(player.pAct.offset) ||
      !this.d2.process.isValidOffset(player.pPlayer.offset) ||
      !this.d2.process.isValidOffset(player.pPath.offset)
    ) {
      log.warn(
        { act: toHex(player.pAct.offset), player: toHex(player.pPlayer.offset), path: toHex(player.pPath.offset) },
        'InvalidOffset',
      );
      return null;
    }
    return player;
  }

  get player(): Promise<UnitPlayer> {
    return this.d2.readStrutAt(this.offset, UnitAnyPlayerStrut);
  }

  get act(): Promise<Act> {
    return this.player.then((p) => {
      if (!this.d2.process.isValidOffset(p.pAct.offset)) {
        logger.error({ offset: toHex(p.pAct.offset) }, 'InvalidOffset:Act');
      }
      return this.d2.readStrutAt(p.pAct.offset, ActStrut);
    });
  }

  get path(): Promise<Path> {
    return this.player.then((p) => {
      if (!this.d2.process.isValidOffset(p.pPath.offset)) {
        logger.error({ offset: toHex(p.pPath.offset) }, 'InvalidOffset:Path');
      }
      return this.d2.readStrutAt(p.pPath.offset, PathStrut);
    });
  }
}
