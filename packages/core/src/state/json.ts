import { Act, Difficulty, ItemCategory, ItemQuality, NpcEnchant, NpcFlags } from '@diablo2/data';

export interface GameStateJson {
  id: string;
  createdAt: number;
  endedAt?: number;
  map: MapJson;
  player: PlayerJson;
  units: UnitJson[];
  items: ItemJson[];
  objects: ObjectJson[];
  kills: KillJson[];
}

export interface BaseGameJson {
  updatedAt: number;
  id: number;
  x: number;
  y: number;
  name: string;
}

export interface MercenaryJson {
  id: number;
  xp: XpStateJson;
}

export type UnitJson = PlayerJson | NpcJson;
export interface PlayerJson extends BaseGameJson {
  type: 'player';
  level: number;
  mercenary?: MercenaryJson;
  xp: XpStateJson;
  life: number;
}

export interface NpcJson extends BaseGameJson {
  type: 'npc';
  code: number;
  life: number;
  flags: NpcFlags;
  enchants: { id: NpcEnchant; name: keyof typeof NpcEnchant }[];
}

export interface ItemJson extends BaseGameJson {
  code: string;
  category: { id: ItemCategory; name: keyof typeof ItemCategory };
  quality: { id: ItemQuality; name: keyof typeof ItemQuality };
  level: number;
}
export interface ObjectJson {
  type: string;
}

export interface MapJson {
  id: number;
  act: Act;
  difficulty: Difficulty;
  isHardcore: boolean;
}

export interface XpStateJson {
  start: number;
  current: number;
  diff: number;
}

export interface KillJson {
  code: number;
  name: string;
  total: number;
  special?: string[];
  isChampion?: number;
  isUnique?: number;
  isSuperUnique?: number;
  isMinion?: number;
  isGhostly?: number;
}
