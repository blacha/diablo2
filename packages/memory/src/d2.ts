import { StrutAny, StrutInfer, toHex } from 'binparse';
import 'source-map-support/register.js';
import { Diablo2Player } from './d2.player.js';
import { LogType } from './logger.js';
import { Process } from './process.js';
import { Scanner, ScannerBuffer } from './scanner.js';
import { PlayerStrut } from './structures.js';
import { D2RStrut } from './struts/d2r.js';
import { Pointer } from './struts/pointer.js';
import { dump } from './util/dump.js';

export class Diablo2Process {
  process: Process;

  lastGoodAddress = 0x22000000;
  constructor(proc: Process) {
    this.process = proc;
  }

  async dump(address: number, count = 100): Promise<void> {
    const data = await this.process.read(address, count);
    dump(data, toHex(address));
  }

  async readStrutAt<T extends StrutAny>(offset: number, strut: T, size = strut.size): Promise<StrutInfer<T>> {
    const buf = await this.process.read(offset, size);
    return strut.raw(buf);
  }

  /** Find the running diablo2 process */
  static async find(game: string | number = 'Game.exe'): Promise<Diablo2Process | null> {
    if (typeof game === 'number') return new Diablo2Process(new Process(game));
    const pid = await Process.findPidByName(game);
    if (pid == null) return null;
    return new Diablo2Process(new Process(pid));
  }

  async scanForPlayerD2r(playerName: string, logger: LogType): Promise<Diablo2Player | null> {
    for await (const mem of this.process.scanDistance(0x7fffd3000000, (f) => f.line.startsWith('7fff'))) {
      for (const nameOffset of ScannerBuffer.text(mem.buffer, playerName, 16)) {
        const memoryOffset = nameOffset + mem.map.start;

        const strut = PlayerStrut.raw(mem.buffer, nameOffset);
        if (Pointer.isPointersValid(strut) > 0) continue;

        const pointerBuf = ScannerBuffer.lu64(memoryOffset);

        for await (const p of this.process.scanDistance(
          this.lastGoodAddress,
          (f) => Math.abs(f.start - this.lastGoodAddress) < 0xfffffff,
        )) {
          for (const off of ScannerBuffer.buffer(p.buffer, pointerBuf)) {
            const playerStrutOffset = off - 16;

            const unit = D2RStrut.UnitPlayer.raw(p.buffer, playerStrutOffset);
            logger.info(
              {
                offset: toHex(nameOffset + mem.map.start),
                unit: toHex(playerStrutOffset + p.map.start),
                pointers: Pointer.isPointersValid(unit),
              },
              'Player:Offset:Pointer',
            );

            if (Pointer.isPointersValid(unit) === 0) continue;
            logger.info(
              { offset: toHex(nameOffset + mem.map.start), unit: toHex(playerStrutOffset + p.map.start) },
              'Player:Offset:Pointer:Found',
            );

            this.lastGoodAddress = playerStrutOffset + p.map.start;
            return new Diablo2Player(this, playerStrutOffset + p.map.start);
          }
        }
      }
    }

    logger.warn({ playerName }, 'Player:NotFound');
    return null;
  }

  async scanForPlayerD2c(playerName: string, logger: LogType): Promise<Diablo2Player | null> {
    // Find all references to the player name
    logger.info({ process: this.process.pid, playerName }, 'StartScan');
    // Look for objects that look like the PlayerStrut object
    const goodOffsets: number[] = [];
    console.log('ScanName', playerName);

    for await (const offset of Scanner.text(this.process, playerName, 16)) {
      logger.info({ process: this.process.pid, playerName, offset: toHex(offset) }, 'NameOffsets');

      const strut = await this.readStrutAt(offset, PlayerStrut);

      if (!strut.waypoint.normal.isValid) continue;
      if (!strut.waypoint.nightmare.isValid) continue;
      if (!strut.waypoint.hell.isValid) continue;

      if (!strut.quest.normal.isValid) continue;
      if (!strut.quest.nightmare.isValid) continue;
      if (!strut.quest.hell.isValid) continue;
      logger.debug({ offset: toHex(offset), player: strut }, 'FoundOffset');

      goodOffsets.push(offset);
    }

    if (goodOffsets.length === 0) {
      logger.error({}, 'Unable to find player information');
      return null;
    }

    // Find pointers to the player strut and see if any look like the Act object
    const res = await this.scanForPlayerUnit(goodOffsets, logger);

    if (res == null) {
      logger.error({}, 'Unable to find player information');
      return null;
    }

    const player = await res.player;
    const act = await res.getAct(player, logger);
    logger.info({ offset: toHex(player.pAct.offset), mapSeed: act.mapSeed }, 'MapSeed');

    const path = await res.getPath(player, logger);
    logger.info({ offset: toHex(player.pPath.offset), path: path }, 'Path');

    return res;
  }

  async scanForPlayerUnit(offsets: number[], logger: LogType): Promise<Diablo2Player | null> {
    for await (const { buffer, offset } of this.process.scan()) {
      for (let i = 0; i < buffer.length - Pointer.type.size; i++) {
        const val = Pointer.type.raw(buffer, i);

        for (const off of offsets) {
          if (val !== off) continue;
          const unitAny = D2RStrut.UnitPlayer.raw(buffer, i - 16);

          // Unit should be a player
          if (unitAny.type !== 1) continue;

          if (unitAny.pAct.offset === 0) continue;
          logger.info({ offset: toHex(offset + i), player: unitAny, from: toHex(off) }, 'FoundPlayer');

          return new Diablo2Player(this, offset + i - 16);
        }
      }
    }
    return null;
  }
}
