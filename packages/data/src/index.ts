export { Attribute } from './attribute';
export { Act } from './act';
export { Difficulty } from './difficulty';
export { UnitType, UnitVisibility } from './unit';
export { GameObjectMode, GameObjectInteraction } from './game.object';
export { ItemActionType, ItemCategory, ItemDestination, ItemQuality, ItemContainer } from './item';
export { PlayerClass } from './player.class';
export { WarpType } from './warp';

export function toHex(num: number, padding = 2): string {
  return `0x` + num.toString(16).padStart(padding, '0');
}
