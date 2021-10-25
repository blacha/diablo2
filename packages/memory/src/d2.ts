import { Diablo2Version } from '@diablo2/data';
import { bp, StrutAny, StrutInfer, toHex } from 'binparse';
import 'source-map-support/register.js';
import { Diablo2Player } from './d2.player.js';
import { LogType } from './logger.js';
import { Process } from './process.js';
import { ScannerBuffer } from './scanner.js';
import { D2cStrut } from './struts/d2c.js';
import { D2rStrut } from './struts/d2r.js';
import { Pointer } from './struts/pointer.js';
import { dump } from './util/dump.js';

export class Diablo2Process {
  version: Diablo2Version;
  process: Process;

  lastGoodAddress = {
    name: Number(process.env.D2_MEMORY_PLAYER_NAME || 0),
    player: Number(process.env.D2_MEMORY_PLAYER_UNIT || 0),
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
  static async find(version: Diablo2Version): Promise<Diablo2Process> {
    if (version === Diablo2Version.Resurrected) Pointer.type = bp.lu64;
    if (version === Diablo2Version.Classic) Pointer.type = bp.lu32;
    const procName = version === Diablo2Version.Classic ? 'Game.exe' : 'D2R.exe';
    const pid = await Process.findPidByName(procName);
    if (pid == null) throw new Error('Unable to find process: ' + procName);
    return new Diablo2Process(new Process(pid), version);
  }

  async scanForPlayer(playerName: string, logger: LogType): Promise<Diablo2Player | null> {
    const struts = this.strut;
    if (this.lastGoodAddress.name > 0) {
      logger.info({ lastGoodAddress: this.lastGoodAddress }, 'Offsets:Previous');
    }

    for await (const mem of this.process.scanDistance(this.lastGoodAddress.name, (f) => {
      if (this.version === Diablo2Version.Classic) return true;
      return f.line.includes('7fff');
    })) {
      for (const nameOffset of ScannerBuffer.text(mem.buffer, playerName, 16)) {
        const playerNameOffset = nameOffset + mem.map.start;

        const strut = struts.PlayerData.raw(mem.buffer, nameOffset);

        if (!strut.questNormal.isValid) continue;
        if (!strut.questNightmare.isValid) continue;
        if (!strut.questHell.isValid) continue;

        if (!strut.wpNormal.isValid) continue;
        if (!strut.wpNightmare.isValid) continue;
        if (!strut.wpHell.isValid) continue;

        logger.info({ offset: toHex(playerNameOffset) }, 'Player:Offset');

        const lastPlayer = this.lastGoodAddress.player;
        for await (const p of this.process.scanDistance(
          lastPlayer,
          (f) => lastPlayer === 0 || Math.abs(f.start - lastPlayer) < 0x0f_ff_ff_ff,
        )) {
          for (const off of ScannerBuffer.pointer(p.buffer, playerNameOffset)) {
            const verOffset = this.version === Diablo2Version.Classic ? 20 : 16;
            const playerRelStrutOffset = off - verOffset;
            const playerStrutOffset = playerRelStrutOffset + p.map.start;

            const unit = struts.UnitPlayer.raw(p.buffer, playerRelStrutOffset);
            logger.info(
              {
                offset: toHex(playerNameOffset),
                unit: toHex(playerStrutOffset),
                pointers: Pointer.isPointersValid(unit),
              },
              'Player:Offset:Pointer',
            );

            if (Pointer.isPointersValid(unit) === 0) continue;
            logger.info(
              { offset: toHex(playerNameOffset), unit: toHex(playerStrutOffset) },
              'Player:Offset:Pointer:Found',
            );

            this.lastGoodAddress.player = playerStrutOffset;
            this.lastGoodAddress.name = playerNameOffset;

            return new Diablo2Player(this, playerStrutOffset);
          }
        }
      }
    }

    logger.warn({ playerName }, 'Player:NotFound');
    process.exit();
  }
}
