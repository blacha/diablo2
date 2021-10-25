import { Logger } from '@diablo2/bintools';
import { Difficulty } from '@diablo2/data';
import { Diablo2ParsedPacket } from '@diablo2/packets';
import * as GameJson from '@diablo2/state';

type OnCloseEvent = (game: Diablo2State) => void;
const MaxAgeMs = 5 * 60_000;
const MaxDistance = 5_000;
export class Diablo2State {
  createdAt: number = Date.now();
  updatedAt: number;

  endedAt?: number;

  playerId = -1;
  players: Map<number, GameJson.Diablo2PlayerJson> = new Map();
  units: Map<number, GameJson.Diablo2UnitJson> = new Map();
  objects: Map<number, GameJson.Diablo2ObjectJson> = new Map();
  items: Map<number, GameJson.Diablo2ItemJson> = new Map();

  map: GameJson.Diablo2MapJson = { id: -1, act: -1, difficulty: -1, isHardcore: false };

  kills: Map<number, GameJson.Diablo2KillJson> = new Map();

  onChange?: () => void;
  id: string;
  log: Logger;

  get gameId(): string | null {
    if (this.player.name == null) return null;
    if (this.map.id === -1) return null;
    return `${this.id}-${this.player.name}-${Difficulty[this.map.difficulty]}-${this.map.id}`;
  }

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

  onCloseListeners: OnCloseEvent[] = [];
  onClose(cb: OnCloseEvent): void {
    this.onCloseListeners.push(cb);
  }

  get duration(): number {
    if (this.endedAt == null) return -1;
    return this.endedAt - this.createdAt;
  }
  get player(): GameJson.Diablo2PlayerJson {
    const player = this.players.get(this.playerId);
    if (player) return player;

    // console.trace('Invalid player state, resetting');
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
    } as GameJson.Diablo2PlayerJson;
    this.players.set(this.playerId, resetPlayer);
    return resetPlayer;
  }

  isMe(id: number): boolean {
    if (this.playerId === id || id == null) return true;
    return false;
  }

  addPlayer(id: number, name: string, x = -1, y = -1): void {
    if (this.playerId === -1) this.playerId = id;

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
        xp: { current: -1, start: -1, diff: 0 },
      } as GameJson.Diablo2PlayerJson;
    }
    if (x !== -1) {
      existing.x = x;
      existing.y = y;
      this.dirty();
    }
    this.players.set(id, existing);
  }

  trackXp(num: number, isSet = false): void {
    const xp = this.player.xp;
    if (xp.current === -1 || isSet) xp.current = num;
    else xp.current += num;
    if (xp.start === -1) xp.start = xp.current;

    xp.diff = xp.current - xp.start;
    this.dirty();
  }

  trackItem(itm: GameJson.Diablo2ItemJson): void {
    let existing = this.items.get(itm.id);
    if (existing == null) {
      existing = itm;
      this.items.set(itm.id, itm);
    }
    existing.updatedAt = Date.now();
    this.dirty();
  }

  trackNpc(npc: GameJson.Diablo2NpcJson | GameJson.Diablo2PlayerJson): void {
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

  movePlayer(pkt: Diablo2ParsedPacket<unknown> | undefined, id: number, x: number, y: number): void {
    // console.log('MovePlayer', pkt.packet.name, id, x, y);
    if (x === 0 || y === 0) return;
    const player = this.players.get(id);
    if (player == null) return;

    player.updatedAt = Date.now();
    if (player.x === x && player.y === y) return;
    this.log.trace({ packet: pkt?.packet.name, player: player.name, id, x, y }, 'Player:Move');

    player.x = x;
    player.y = y;
    this.dirty();
  }

  trackKill(u: GameJson.Diablo2NpcJson): void {
    if (u.code === -1) return;
    let kill = this.kills.get(u.code);
    if (kill == null) {
      kill = {
        name: u.name,
        code: u.code,
        total: 0,
      };
      this.kills.set(u.code, kill);
    }
    kill.total += 1;
    if (u.flags.isMinion) kill.isMinion = (kill.isMinion || 0) + 1;
    if (u.flags.isChampion) kill.isChampion = (kill.isChampion || 0) + 1;
    if (u.flags.isSuperUnique) kill.isSuperUnique = (kill.isSuperUnique || 0) + 1;
    if (u.flags.isGhostly) kill.isGhostly = (kill.isGhostly || 0) + 1;
    if (u.flags.isSuperUnique) {
      kill.special = kill.special ?? [];
      kill.special.push(u.name);
      return;
    }

    if (u.name !== kill.name) {
      this.log.warn({ kill, unit: u.name }, 'Kill:Name:missmatch');
    }
  }

  moveNpc(pkt: Diablo2ParsedPacket<unknown>, id: number, x: number, y: number, life = -1): void {
    if (x === 0 || y === 0) return;
    let unit = this.units.get(id);

    if (life === 0) {
      if (unit == null) return;
      if (unit.type === 'npc') this.trackKill(unit);
      this.units.delete(id);
      this.dirty();
      return;
    }

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
        enchants: [],
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
    const isAlreadyClosed = this.isClosed;
    this.endedAt = Date.now();
    this.objects.clear();
    if (isAlreadyClosed === false) this.onCloseListeners.forEach((cb) => cb(this));
  }

  /** Remove all the NPCs from the unit list */
  removeNpc(): void {
    const units = this.units;
    this.units = new Map();
    for (const unit of units.values()) {
      if (unit.type === 'player') this.units.set(unit.id, unit);
    }
  }

  get isClosed(): boolean {
    return this.endedAt != null;
  }

  toJSON(): GameJson.Diablo2GameStateJson {
    const unitRemove = this.filterOld(this.units);
    if (unitRemove > 0) this.log.info({ units: unitRemove }, 'CleanUp');
    return {
      id: this.id,
      createdAt: this.createdAt,
      endedAt: this.endedAt,
      player: this.player,
      map: this.map,
      objects: [...this.objects.values()],
      units: [...this.units.values()],
      items: [...this.items.values()].sort(latestUpdated).slice(0, 25),
      kills: [...this.kills.values()],
    };
  }
  filterOld(items: Map<unknown, GameJson.Diablo2BaseGameJson>): number {
    const player = this.player;

    const timeNow = Date.now();
    const toDelete: number[] = [];
    for (const item of items.values()) {
      const timeDiff = timeNow - item.updatedAt;
      if (timeDiff < 60_000) continue;
      if (timeDiff > MaxAgeMs) toDelete.push(item.id);
      else if (Math.abs(item.x - player.x) > MaxDistance) toDelete.push(item.id);
      else if (Math.abs(item.y - player.y) > MaxDistance) toDelete.push(item.id);
    }
    for (const id of toDelete) items.delete(id);
    return toDelete.length;
  }
}

function latestUpdated(a: GameJson.Diablo2BaseGameJson, b: GameJson.Diablo2BaseGameJson): number {
  return b.updatedAt - a.updatedAt;
}
