import { Act } from './act.js';
import { Difficulty } from './difficulty.js';

/** Specific diablo 2 level @see levels.txt */
export interface Diablo2Level {
  /** Level id @see levels.txt */
  id: number;
  /** Name of the level @example "Harrogath" */
  name: string;
  /** Collision map for the level */
  map: number[][];
  /** Preset items */
  objects: Diablo2LevelObject[];
  /** Offset from the game world */
  offset: { x: number; y: number };
  /** Reported width and height of the level */
  size: { width: number; height: number };
}

export type Diablo2LevelObject = Diablo2LevelObjectObject | Diablo2LevelNpc | Diablo2LevelExit | Diablo2LevelNpcSuper;

export interface Diablo2LevelBase {
  /**
   * Id of object
   * For NPCs see monstats.txt
   * For Objects see objects.txt
   * for Exits see levels.txt
   */
  id: number;
  /** X offset relative to the level */
  x: number;
  /** Y offset relative to the level */
  y: number;
}

export type Diablo2ItemClasses =
  | 'casket' // OpCode 1
  /* Chests dead barb etc.. but not super chests @see "chest:super" */
  | 'chest' // OpCode 4
  | 'chest-super' // ItemCode: 580 or 581
  | 'chest-exploding'
  | 'door'
  | 'shrine' // OpCode 2
  | 'well' // OpCode 22
  /** Useful quest items like hordiric orifice */
  | 'quest'
  /** Small items like ajar or basket */
  | 'urn' // OpCode 3
  | 'waypoint' // OpCode 22
  | 'urn-evil' // OpCode 68
  | 'barrel' // OpCode  5
  | 'barrel-exploding' // OpCode 7
  | 'rack-weapon' // OpCode 20
  | 'rack-armor'; // OpCode 19

export interface Diablo2LevelObjectObject extends Diablo2LevelBase {
  type: 'object';
  class: Diablo2ItemClasses;
  name?: string;
}
export interface Diablo2LevelNpc extends Diablo2LevelBase {
  type: 'npc';

  /** Name of the NPC if it exists */
  name?: string;
  /** Is this npc a super unique monster */
  isSuperUnique?: boolean;
}

/** Super unique NPC like "Eldritch the Rectifier" */
export interface Diablo2LevelNpcSuper extends Diablo2LevelNpc {
  isSuperUnique: true;
  superId: number;
}

export interface Diablo2LevelExit extends Diablo2LevelBase {
  type: 'exit';
  name?: string;
  /**
   * Is this the correct exit for quests
   * - The Correct tomb
   * - The Ruined temple
   */
  isGoodExit?: boolean;
}

/** collection of maps to make up a act */
export interface Diablo2Map {
  /** Id of map generation */
  id: string;
  /** Diablo2 Map Seed */
  seed: number;
  /** Game Difficulty */
  difficulty: Difficulty;
  /** Game Act, only exists if the map generation was for a specific act */
  act?: Act;
  /** All the levels generated */
  levels: Diablo2Level[];
}
