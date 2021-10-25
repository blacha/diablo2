import { Act, Difficulty, ItemCategory, ItemQuality, NpcEnchant, NpcFlags } from '@diablo2/data';

export interface Diablo2GameStateJson {
  id: string;
  createdAt: number;
  endedAt?: number;
  map: Diablo2MapJson;
  player: Diablo2PlayerJson;
  units: Diablo2UnitJson[];
  items: Diablo2ItemJson[];
  objects: Diablo2ObjectJson[];
  kills: Diablo2KillJson[];
}

export interface Diablo2BaseGameJson {
  updatedAt: number;
  id: number;
  x: number;
  y: number;
  name: string;
}

export interface Diablo2MercenaryJson {
  id: number;
  xp: Diablo2XpStateJson;
}

export type Diablo2UnitJson = Diablo2PlayerJson | Diablo2NpcJson;
export interface Diablo2PlayerJson extends Diablo2BaseGameJson {
  type: 'player';
  level: number;
  mercenary?: Diablo2MercenaryJson;
  xp: Diablo2XpStateJson;
  life: number;
}

export interface Diablo2NpcJson extends Diablo2BaseGameJson {
  type: 'npc';
  code: number;
  life: number;
  flags: NpcFlags;
  enchants: { id: NpcEnchant; name: keyof typeof NpcEnchant }[];
}

export interface Diablo2ItemJson extends Diablo2BaseGameJson {
  code: string;
  category: { id: ItemCategory; name: keyof typeof ItemCategory };
  quality: { id: ItemQuality; name: keyof typeof ItemQuality };
  level: number;
}
export interface Diablo2ObjectJson {
  type: string;
}

export interface Diablo2MapJson {
  id: number;
  act: Act;
  difficulty: Difficulty;
  isHardcore: boolean;
}

export interface Diablo2XpStateJson {
  start: number;
  current: number;
  diff: number;
}

export interface Diablo2KillJson {
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
