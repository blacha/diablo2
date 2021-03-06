// import { NpcJson } from './game.npc';
import { XpState } from './game.xp';
import { GameStateJson, ItemJson, MapJson, NpcJson, ObjectJson, PlayerJson } from './json';

export class Diablo2GameState {
  player: PlayerJson;

  createdAt: number = Date.now();
  endedAt?: number;

  playerXp: XpState = new XpState();
  mercXp: XpState = new XpState();
  npc: Map<number, NpcJson> = new Map();
  object: Map<number, ObjectJson> = new Map();
  item: Map<number, ItemJson> = new Map();
  items = [];

  map: MapJson;

  constructor() {
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

  isMe(id: number): boolean {
    if (this.player.id === -1) {
      this.player.id = 1;
    }
    if (this.player.id === id || id == null) return true;
    return false;
  }

  addPlayer(id: number, name: string): void {
    if (this.player.id == null) {
      this.player.id = id;
      this.player.name = name;
    }
  }

  setPlayerLevel(id: number, level: number): void {
    if (this.isMe(id)) this.player.level = level;
  }

  move(id: number, x: number, y: number): void {
    if (this.isMe(id)) {
      this.player.updatedAt = Date.now();
      this.player.x = x;
      this.player.y = y;
      return;
    }

    let npc = this.npc.get(id);
    if (npc == null) {
      npc = {
        id,
        updatedAt: Date.now(),
        x,
        y,
        code: -1,
        name: 'Unknown',
        flags: {},
      };
      this.npc.set(id, npc);
    }
    npc.x = x;
    npc.y = y;
    npc.updatedAt = Date.now();
  }

  moveMaybe(x: number, y: number): void {
    const diff = Math.abs(this.player.updatedAt - Date.now());
    if (diff > 2000) {
      this.player.x = x;
      this.player.y = y;
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
