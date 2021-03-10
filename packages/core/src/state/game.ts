import { Logger } from '@diablo2/bintools';
import { Diablo2ParsedPacket } from '@diablo2/packets';
import { BaseGameJson, GameStateJson, ItemJson, MapJson, NpcJson, ObjectJson, PlayerJson, UnitJson } from './json';

const MaxAgeMs = 5 * 60_000;
const MaxDistance = 5_000;
export class Diablo2State {
  createdAt: number = Date.now();
  updatedAt: number;

  endedAt?: number;

  playerId = -1;
  players: Map<number, PlayerJson> = new Map();
  units: Map<number, UnitJson> = new Map();
  objects: Map<number, ObjectJson> = new Map();
  items: Map<number, ItemJson> = new Map();

  map: MapJson = { id: -1, act: -1, difficulty: -1, isHardcore: false };

  onChange?: () => void;
  id: string;
  log: Logger;

  constructor(id: string, log: Logger) {
    this.id = id;
    this.log = log;
  }

  _dirtyTimeout?: number | NodeJS.Timeout;
  dirty(): void {
    this.updatedAt = Date.now();

    if (this._dirtyTimeout == null) {
      this._dirtyTimeout = setTimeout(() => {
        this.onChange?.();
        this._dirtyTimeout = undefined;
      }, 10);
    }
  }

  get player(): PlayerJson {
    const player = this.players.get(this.playerId);
    if (player) return player;

    console.trace('Invalid player state, resetting');
    this.playerId = -1;
    const resetPlayer = {
      id: -1,
      type: 'player',
      name: 'ResetPlayerState??',
      x: -1,
      y: -1,
      updatedAt: Date.now(),
      life: -1,
      xp: { current: -1, start: -1 },
    } as PlayerJson;
    this.players.set(this.playerId, resetPlayer);
    return resetPlayer;
  }

  isMe(id: number): boolean {
    if (this.playerId === id || id == null) return true;
    return false;
  }

  addPlayer(id: number, name: string, x = -1, y = -1): void {
    if (this.playerId === -1) this.playerId = id;
    console.log('AddPlayer', id, name);

    let existing = this.players.get(id);
    if (existing == null || existing.name !== name || existing.type !== 'player') {
      existing = {
        id,
        type: 'player',
        name,
        x,
        y,
        updatedAt: Date.now(),
        life: -1,
        xp: { current: -1, start: -1 },
      } as PlayerJson;
    }
    if (x !== -1) {
      existing.x = x;
      existing.y = y;
      this.dirty();
    }
    this.players.set(id, existing);
  }

  trackXp(num: number, isSet = false): void {
    if (this.player.xp.current === -1 || isSet) this.player.xp.current = num;
    else this.player.xp.current += num;
    if (this.player.xp.start === -1) this.player.xp.start = this.player.xp.current;

    this.dirty();
  }

  trackItem(itm: ItemJson): void {
    let existing = this.items.get(itm.id);
    if (existing == null) {
      existing = itm;
      this.items.set(itm.id, itm);
    }
    existing.updatedAt = Date.now();
    this.dirty();
  }

  trackNpc(npc: NpcJson | PlayerJson): void {
    let existing = this.units.get(npc.id);
    if (existing == null) {
      existing = npc;
      this.units.set(npc.id, npc);
    }
    // console.log('TrackNpc', npc.id, npc.name, npc.life);
    existing.updatedAt = Date.now();
    this.dirty();
  }

  setPlayerLevel(id: number, level: number): void {
    if (this.isMe(id)) this.player.level = level;
  }

  movePlayer(pkt: Diablo2ParsedPacket<unknown>, id: number, x: number, y: number): void {
    this.log.debug({ packet: pkt.packet.name, id, x, y }, 'Player:Move');
    // console.log('MovePlayer', pkt.packet.name, id, x, y);
    if (x === 0 || y === 0) return;
    const player = this.players.get(id);
    if (player == null) return;
    player.x = x;
    player.y = y;
    player.updatedAt = Date.now();
    this.dirty();
  }

  moveNpc(pkt: Diablo2ParsedPacket<unknown>, id: number, x: number, y: number, life = -1): void {
    if (x === 0 || y === 0) return;
    if (life === 0) {
      if (!this.units.has(id)) return;
      this.units.delete(id);
      this.dirty();
      return;
    }

    let unit = this.units.get(id);
    if (unit == null) {
      unit = {
        type: 'npc',
        id,
        updatedAt: Date.now(),
        x,
        y,
        life: -1,
        code: -1,
        name: 'Unknown',
        flags: {},
      };
      this.units.set(id, unit);
    }
    unit.x = x;
    unit.y = y;
    unit.life = life;
    unit.updatedAt = Date.now();
    this.dirty();
  }

  moveTo(pkt: Diablo2ParsedPacket<unknown>, x: number, y: number): void {
    const player = this.player;

    const diff = Math.abs(player.updatedAt - Date.now());
    if (diff > 1500) this.movePlayer(pkt, this.player.id, x, y);
  }

  close(): void {
    this.endedAt = Date.now();
    this.objects.clear();
  }

  /** Remove all the NPCs from the unit list */
  removeNpc(): void {
    const units = this.units;
    this.units = new Map();
    for (const unit of units.values()) {
      if (unit.type === 'player') this.units.set(unit.id, unit);
    }
    console.log(this.units);
  }

  get isClosed(): boolean {
    return this.endedAt != null;
  }

  toJSON(): GameStateJson {
    const player = this.player;
    const toDelete: number[] = [];
    for (const unit of this.units.values()) {
      const timeDiff = Date.now() - unit.updatedAt;
      if (timeDiff < 60_000) continue;
      if (
        timeDiff > MaxAgeMs ||
        Math.abs(unit.x - player.x) > MaxDistance ||
        Math.abs(unit.y - player.y) > MaxDistance
      ) {
        toDelete.push(unit.id);
      }
    }
    for (const id of toDelete) this.units.delete(id);
    if (toDelete.length > 1) this.log.info({ count: toDelete.length }, 'NpcCleanup');
    return {
      id: this.id,
      createdAt: this.createdAt,
      endedAt: this.endedAt,
      player,
      map: this.map,
      objects: [...this.objects.values()],
      units: [...this.units.values()],
      items: [...this.items.values()].sort(latestUpdated),
    };
  }
}

function latestUpdated(a: BaseGameJson, b: BaseGameJson): number {
  return a.updatedAt - b.updatedAt;
}
