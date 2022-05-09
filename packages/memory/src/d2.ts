import { Diablo2Version } from '@diablo2/data';
import { StrutAny, StrutInfer, toHex } from 'binparse';
import 'source-map-support/register.js';
import { Diablo2Player } from './d2.player.js';
import { LogType } from './logger.js';
import { Process } from './process.js';
import { ScannerBuffer } from './scanner.js';
import { D2rUnitDataPlayerStrut, D2rUnitStrut } from './struts/d2r.unit.any.js';
import { Pointer } from './struts/pointer.js';
import { dump } from './util/dump.js';

export class Diablo2Process {
  version: Diablo2Version = Diablo2Version.Resurrected;
  process: Process;

  lastOffset = { name: 0, player: 0, seed: 0 };

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
  static async find(): Promise<Diablo2Process> {
    const procName = 'D2R.exe';
    const pid = await Process.findPidByName(procName);
    if (pid == null) throw new Error('Unable to find process: ' + procName);
    return new Diablo2Process(new Process(pid));
  }

  async scanForPlayer(playerName: string, logger: LogType): Promise<Diablo2Player | null> {
    if (this.lastOffset.name > 0) {
      logger.info({ lastGoodAddress: this.lastOffset }, 'Offsets:Previous');

      try {
        const unit = await this.readStrutAt(this.lastOffset.player, D2rUnitStrut);
        if (Pointer.isPointersValid(unit) !== 0) return new Diablo2Player(this, this.lastOffset.player);
      } catch (e) {
        console.log('Cache:Failed', { e });
      }
    }

    for await (const mem of this.process.scanDistance(this.lastOffset.name)) {
      for (const nameOffset of ScannerBuffer.text(mem.buffer, playerName, 0x40)) {
        const playerNameOffset = nameOffset + mem.map.start;

        const strut = D2rUnitDataPlayerStrut.raw(mem.buffer, nameOffset);

        if (!strut.questNormal.isValid) continue;
        if (!strut.questNightmare.isValid) continue;
        if (!strut.questHell.isValid) continue;

        if (!strut.wpNormal.isValid) continue;
        if (!strut.wpNightmare.isValid) continue;
        if (!strut.wpHell.isValid) continue;

        logger.info({ offset: toHex(playerNameOffset) }, 'Player:Offset');

        const lastPlayer = this.lastOffset.player;
        for await (const p of this.process.scanDistance(
          lastPlayer,
          (f) => lastPlayer === 0 || Math.abs(f.start - lastPlayer) < 0xff_ff_ff_ff,
        )) {
          for (const off of ScannerBuffer.pointer(p.buffer, playerNameOffset)) {
            const verOffset = this.version === Diablo2Version.Classic ? 20 : 16;
            const playerRelStrutOffset = off - verOffset;
            const playerStrutOffset = playerRelStrutOffset + p.map.start;

            const unit = D2rUnitStrut.raw(p.buffer, playerRelStrutOffset);
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

            this.lastOffset.player = playerStrutOffset;
            this.lastOffset.name = playerNameOffset;

            return new Diablo2Player(this, playerStrutOffset);
          }
        }
      }
    }

    logger.warn({ playerName }, 'Player:NotFound');
    process.exit();
  }
}
