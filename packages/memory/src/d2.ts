import { bp, StrutInfer, toHex } from 'binparse';
import pino from 'pino';
import { PrettyTransform } from 'pretty-json-log';
import 'source-map-support/register';
import { ulid } from 'ulid';
import { ProcessMemory } from './process';
import { PlayerStrut, UnitAnyPlayer } from './structures';

const pinoLogger = process.stdout.isTTY ? pino(PrettyTransform.stream()) : pino();
export const logger = pinoLogger.child({ id: ulid().toLowerCase() });
logger.level = 'debug';

export class D2Process {
  proc: ProcessMemory;
  /** Size of pointers */
  pointer = bp.lu32;

  constructor(proc: ProcessMemory) {
    this.proc = proc;
  }

  static async create(game: string | number = 'Game.exe'): Promise<D2Process> {
    if (typeof game === 'number') return new D2Process(new ProcessMemory(game));
    const proc = await ProcessMemory.fromName(game);
    if (proc == null) throw new Error('Unable to find "Game.exe"');
    return new D2Process(proc);
  }

  async scanForMapSeed(playerName: string): Promise<number | null> {
    // Find all references to the player name
    logger.info({ process: this.proc.pid, playerName }, 'StartScan');
    const playerNameOffsets = await this.proc.text(playerName);
    logger.info({ process: this.proc.pid, playerName, offsets: playerNameOffsets.length }, 'NameOffsets');

    // Look for objects that look like the PlayerStrut object
    const goodOffsets: number[] = [];
    for (const offset of playerNameOffsets) {
      const strut = await this.proc.readStrut(offset, PlayerStrut);
      if (strut.waypoint.normal === 0) continue;
      logger.debug({ offset: toHex(offset), player: strut }, 'FoundOffset');
      goodOffsets.push(offset);
    }

    if (goodOffsets.length === 0) {
      logger.error({}, 'Unable to find player information');
      return null;
    }

    // Find pointers to the player strut and see if any look like the Act object

    let player: StrutInfer<typeof UnitAnyPlayer> | null = null;
    let playerOffset = -1;
    for await (const { buffer, offset } of this.proc.scan()) {
      if (player) break; // TODO should we break early?

      for (let i = 0; i < buffer.length - this.pointer.size; i++) {
        const val = this.pointer.raw(buffer, i);

        for (const off of goodOffsets) {
          if (val !== off) continue;
          const unitAny = UnitAnyPlayer.raw(buffer, i - 16);

          // Unit should be a player
          if (unitAny.type !== 1) continue;

          if (unitAny.pAct.offset === 0) continue;
          logger.info({ offset: toHex(offset), player: unitAny }, 'FoundPlayer');
          // TODO should we break early?
          player = unitAny;
          playerOffset = offset;
          break;
        }
      }
    }

    if (player == null) {
      logger.error({ offset: toHex(playerOffset), player }, 'Unable to find player information');
      return null;
    }
    const act = await player.pAct.fetch(this.proc);

    logger.info({ offset: toHex(player.pAct.offset), mapSeed: act.mapSeed }, 'MapSeed');

    return act.mapSeed;
  }
}
