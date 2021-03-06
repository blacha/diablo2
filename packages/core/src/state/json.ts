import { Act, Difficulty, ItemCategory, ItemQuality, NpcFlags } from '@diablo2/data';

export interface GameStateJson {
  createdAt: number;
  endedAt?: number;
  npc: NpcJson[];
  player: PlayerJson;
  map: MapJson;
  item: ItemJson[];
  object: ObjectJson[];
}

export interface BaseGameJson {
  updatedAt: number;
  id: number;
  x: number;
  y: number;
  name: string;
}

export interface PlayerJson extends BaseGameJson {
  level: number;
  mercenary: MercenaryJson;
  xp: { current: number; start: number };
}
export interface MercenaryJson {
  id: number;
  xp: { current: number; start: number };
}

export interface NpcJson extends BaseGameJson {
  code: number;
  uniqueName?: string;
  flags: NpcFlags;
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
