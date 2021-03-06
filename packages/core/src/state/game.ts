import { GameStateJson, ItemJson, MapJson, NpcJson, ObjectJson, PlayerJson } from './json';

export class Diablo2State {
  player: PlayerJson;

  createdAt: number = Date.now();
  updatedAt: number;

  endedAt?: number;

  npc: Map<number, NpcJson> = new Map();
  object: Map<number, ObjectJson> = new Map();
  item: Map<number, ItemJson> = new Map();
  items = [];

  map: MapJson = { id: -1, act: -1, difficulty: -1, isHardcore: false };

  onChange?: () => void;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.player = {
      updatedAt: Date.now(),
      id: -1,
      name: '??',
      x: 0,
      y: 0,
      level: 0,
      mercenary: { id: -1, xp: { current: -1, start: -1 } },
      xp: { current: -1, start: -1 },
    };
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

  isMe(id: number): boolean {
    if (this.player.id === -1) this.player.id = 1;
    if (this.player.id === id || id == null) return true;
    return false;
  }

  addPlayer(id: number, name: string): void {
    console.log('---AddPlayer', { id, name });
    if (this.player.id == null) {
      this.player.id = id;
      this.player.name = name;
      this.dirty();
    }
  }

  trackXp(num: number, isSet = false): void {
    if (this.player.xp.current === -1 || isSet) this.player.xp.current = num;
    else this.player.xp.current += num;

    if (this.player.xp.start === -1) this.player.xp.start = this.player.xp.current;

    this.dirty();
  }

  trackItem(itm: ItemJson): void {
    let existing = this.item.get(itm.id);
    if (existing == null) {
      existing = itm;
      this.item.set(itm.id, itm);
    }
    existing.updatedAt = Date.now();
    this.dirty();
  }

  trackNpc(npc: NpcJson): void {
    let existing = this.npc.get(npc.id);
    if (existing == null) {
      existing = npc;
      this.npc.set(npc.id, npc);
    }
    existing.updatedAt = Date.now();
    this.dirty();
  }

  setPlayerLevel(id: number, level: number): void {
    if (this.isMe(id)) this.player.level = level;
  }

  move(id: number, x: number, y: number, life = -1): void {
    if (this.isMe(id)) {
      this.player.updatedAt = Date.now();
      this.player.x = x;
      this.player.y = y;
      this.dirty();
      return;
    }

    if (life === 0) {
      if (!this.npc.has(id)) return;
      this.npc.delete(id);
      this.dirty();
      return;
    }

    let npc = this.npc.get(id);
    if (npc == null) {
      npc = {
        id,
        updatedAt: Date.now(),
        x,
        y,
        life: -1,
        code: -1,
        name: 'Unknown',
        flags: {},
      };
      this.npc.set(id, npc);
    }
    npc.x = x;
    npc.y = y;
    npc.updatedAt = Date.now();
    this.dirty();
  }

  moveTo(x: number, y: number): void {
    const diff = Math.abs(this.player.updatedAt - Date.now());
    if (diff > 500) {
      this.player.x = x;
      this.player.y = y;
      this.dirty();
    }
  }

  close(): void {
    this.endedAt = Date.now();
    this.npc.clear();
    this.object.clear();
  }

  get isClosed(): boolean {
    return this.endedAt != null;
  }

  toJSON(): GameStateJson {
    return {
      createdAt: this.createdAt,
      endedAt: this.endedAt,
      player: this.player,
      map: this.map,
      object: [...this.object.values()],
      npc: [...this.npc.values()],
      item: [...this.item.values()],
    };
  }
}
