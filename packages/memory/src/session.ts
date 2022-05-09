import { Diablo2State } from '@diablo2/core';
import { Attribute, Diablo2Mpq, getNpcFlags, ItemQuality, NpcResists, UnitType } from '@diablo2/data';
import { bp, toHex } from 'binparse';
import { Diablo2ItemJson, Diablo2NpcJson } from 'packages/state/build/json.js';
import { Diablo2Process } from './d2.js';
import { Diablo2Player } from './d2.player.js';
import { id, Log, LogType } from './logger.js';
import { PointerUnitDataItem, PointerUnitDataNpc } from './struts/d2r.unit.any.js';

const sleep = (dur: number): Promise<void> => new Promise((r) => setTimeout(r, dur));

export class Diablo2GameSessionMemory {
  state: Diablo2State;
  d2: Diablo2Process;
  playerName: string;

  player: Diablo2Player | null;
  /** Delay to wait between ticks */
  tickSpeed = 250;

  mapSeed: number;
  itemIgnore = new Set<string>();

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
    // this.player = null;
    let backOff = 0;
    while (true) {
      logger.info({ d2Proc: this.d2.process.pid, player: this.playerName }, 'Session:WaitForPlayer');

      await sleep(Math.min(backOff * 500, 5_000));
      backOff++;
      if (this.player) {
        const player = await this.player.validate(logger);
        if (player != null) return this.player;
        continue;
      }

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
      this.state.units.clear();
      this.state.items.clear();
      this.itemIgnore.clear();
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
      if (unit.type === UnitType.NPC) {
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
          const existing = this.state.units.get(unit.unitId);
          if (existing && existing.type === 'npc') {
            this.state.units.delete(unit.unitId);
            this.state.dirty();
            this.state.trackKill(existing);
          }
          continue;
        }

        const loc = await unit.pPath.fetch(this.d2.process);
        const data = await PointerUnitDataNpc.fetch(unit.pData.offset, this.d2.process);
        if (this.state.units.has(unit.unitId)) {
          this.state.moveNpc(unit.unitId, loc.x, loc.y, lifePercent);
        } else {
          const npcJson: Diablo2NpcJson = {
            id: unit.unitId,
            type: 'npc',
            name: monName,
            x: loc.x,
            y: loc.y,
            code: unit.txtFileNo,
            life: lifePercent,
            ...getNpcFlags(data.flags),
            enchants: [],
            updatedAt: Date.now(),
          };
          addNpcResits(stats, npcJson);

          this.state.trackNpc(npcJson);
        }
      } else if (unit.type === UnitType.Item) {
        const itemData = Diablo2Mpq.items.byIndex[unit.txtFileNo];
        const itemKey = `${unit.unitId}-${unit.txtFileNo}`;

        if (this.itemIgnore.has(itemKey)) continue;
        if (this.state.items.has(unit.unitId)) continue;

        if (itemData == null) {
          this.itemIgnore.add(itemKey);
          continue;
        }

        const loc = await unit.pPath.fetch(this.d2.process);
        const data = await PointerUnitDataItem.fetch(unit.pData.offset, this.d2.process);

        const stats = await obj.loadStats(unit, logger);

        const itemJson: Diablo2ItemJson = {
          type: 'item',
          id: unit.unitId,
          updatedAt: Date.now(),
          name: Diablo2Mpq.t(itemData.code) ?? 'Unknown',
          code: itemData.code,
          x: loc.staticX,
          y: loc.staticY,
          quality: { id: data.quality, name: ItemQuality[data.quality] as keyof ItemQuality },
        };

        const sockets = stats.get(Attribute.NumSockets) ?? 0;
        if (sockets > 0) itemJson.sockets = sockets;

        if ((data.flags & ItemFlags.isEthereal) === ItemFlags.isEthereal) itemJson.isEthereal = true;
        if ((data.flags & ItemFlags.isRuneWord) === ItemFlags.isRuneWord) itemJson.isRuneWord = true;
        if ((data.flags & ItemFlags.isIdentified) === ItemFlags.isIdentified) itemJson.isIdentified = true;

        if (shouldTrackItem(itemJson)) {
          this.state.trackItem(itemJson);
        } else {
          this.itemIgnore.add(itemKey);
        }
      }
    }

    const duration = Number(process.hrtime.bigint() - startTime) / 1_000_000;

    if (duration > 10) logger.warn({ duration }, 'Update:Tick:Slow');
    else if (duration > 5) logger.info({ duration }, 'Update:Tick:Slow');
    else logger.trace({ duration }, 'Update:Tick');
  }
}

const ResistStats: { key: keyof NpcResists; attr: Attribute }[] = [
  { key: 'resistPhysical', attr: Attribute.DamageReduced },
  { key: 'resistMagic', attr: Attribute.MagicResist },
  { key: 'resistFire', attr: Attribute.FireResist },
  { key: 'resistLightning', attr: Attribute.LightningResist },
  { key: 'resistCold', attr: Attribute.ColdResist },
  { key: 'resistPoison', attr: Attribute.PoisonResist },
];

function addNpcResits(stats: Map<Attribute, number>, obj: NpcResists): void {
  for (const st of ResistStats) {
    const attr = stats.get(st.attr);
    if (attr == null) continue;
    obj[st.key] = attr;
  }
}

// Track charms
const TrackCodes = new Set(['cm1', 'cm2', 'cm3']);

function shouldTrackItem(i: Diablo2ItemJson): boolean {
  if (i.code.match(/r[0-9][0-9]/)) return true;
  if (i.quality.id === ItemQuality.Set) return true;
  if (i.quality.id === ItemQuality.Unique) return true;
  if (TrackCodes.has(i.code)) return true;

  if ((i.sockets ?? 0) > 1) return true;

  return false;
}

export function dumpStats(stats: Map<Attribute, number>): void {
  for (const stat of stats) {
    console.log(toHex(stat[0]), Attribute[stat[0]], stat[1]);
  }
}

export enum ItemFlags {
  isIdentified = 0x00000010,
  isEthereal = 0x00400000,
  isRuneWord = 0x04000000,
}
