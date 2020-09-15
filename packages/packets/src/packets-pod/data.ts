import { Act, Attribute, Difficulty, PlayerClass, UnitType, WarpType } from '@diablo2/data';
import { bp } from 'binparse';

export const DataAct = bp.enum('Act', bp.u8, Act);
export const DataPlayerClass = bp.enum('PlayerClass', bp.u8, PlayerClass);
export const DataDifficulty = bp.enum('Difficulty', bp.u8, Difficulty);
// export  const DataGameObjectMode = bp.enum('GameObjectMode', bp.u8, GameObjectMode);
// export  const DataGameObjectInteraction = bp.enum('GameObjectInteraction', bp.u8, GameObjectInteraction);
export const DataWarp = bp.enum('Warp', bp.u8, WarpType);
export const DataUnitType = bp.enum('UnitType', bp.u8, UnitType);
export const DataAttribute = bp.lookup('Attribute', bp.u8, (id) => Attribute[id] ?? 'Unknown');
