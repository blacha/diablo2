import { StrutAny, StrutInfer, toHex } from 'binparse';
import 'source-map-support/register.js';
import { Diablo2Player } from './d2.player.js';
import { LogType } from './logger.js';
import { Process } from './process.js';
import { ScannerBuffer } from './scanner.js';
import { D2cStrut } from './struts/d2c.js';
import { D2rStrut } from './struts/d2r.js';
import { Pointer } from './struts/pointer.js';
import { dump } from './util/dump.js';

export enum Diablo2Version {
  Classic,
  Resurrected,
}

export class Diablo2Process {
  version: Diablo2Version;
  process: Process;

  lastGoodAddress = {
    name: 0, //Number(process.env.D2_MEMORY_PLAYER_NAME ?? 0),
    player: 0, //Number(process.env.D2_MEMORY_PLAYER_UNIT ?? 0),
  };

  constructor(proc: Process, version: Diablo2Version) {
    this.process = proc;
    this.version = version;
  }

  get strut(): typeof D2cStrut | typeof D2rStrut {
    if (this.version === Diablo2Version.Classic) return D2cStrut;
    return D2rStrut;
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
  static async find(version: Diablo2Version): Promise<Diablo2Process | null> {
    const pid = await Process.findPidByName(version === Diablo2Version.Classic ? 'Game.exe' : 'D2R.exe');
    if (pid == null) return null;
    return new Diablo2Process(new Process(pid), version);
  }

  async scanForPlayer(playerName: string, logger: LogType): Promise<Diablo2Player | null> {
    const struts = this.strut;

    for await (const mem of this.process.scanDistance(this.lastGoodAddress.name)) {
      for (const nameOffset of ScannerBuffer.text(mem.buffer, playerName, 16)) {
        const playerNameOffset = nameOffset + mem.map.start;

        const strut = struts.PlayerData.raw(mem.buffer, nameOffset);

        if (!strut.questNormal.isValid) continue;
        if (!strut.questNightmare.isValid) continue;
        if (!strut.questHell.isValid) continue;

        if (!strut.wpNormal.isValid) continue;
        if (!strut.wpNightmare.isValid) continue;
        if (!strut.wpHell.isValid) continue;

        logger.info({ offset: toHex(nameOffset + mem.map.start) }, 'Player:Offset');

        const pointerBuf = ScannerBuffer.pointer(playerNameOffset);

        const lastPlayer = this.lastGoodAddress.player;
        for await (const p of this.process.scanDistance(
          lastPlayer,
          (f) => lastPlayer === 0 || Math.abs(f.start - lastPlayer) < 0x0f_ff_ff_ff,
        )) {
          for (const off of ScannerBuffer.buffer(p.buffer, pointerBuf)) {
            const playerStrutOffset = off - 16;

            const unit = struts.UnitPlayer.raw(p.buffer, playerStrutOffset);
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

            this.lastGoodAddress.player = playerStrutOffset + p.map.start;
            this.lastGoodAddress.name = playerNameOffset;

            return new Diablo2Player(this, playerStrutOffset + p.map.start);
          }
        }
      }
    }

    logger.warn({ playerName }, 'Player:NotFound');
    process.exit();
  }
}
