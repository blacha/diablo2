export interface NpcFlags {
  isChampion?: boolean;
  isUnique?: boolean;
  isSuperUnique?: boolean;
  isMinion?: boolean;
  isGhostly?: boolean;
}

/** Extra skills NPC's can have */
export enum NpcEnchant {
  RandomName = 1,
  None = 0,
  Strong = 5,
  Fast = 6,
  Cursed = 7,
  MagicResist = 8,
  Fire = 9,
  Lightning = 17,
  Cold = 18,
  ManaBurn = 25,
  Teleport = 26,
  Spectral = 27,
  StoneSkin = 28,
  MultiShot = 29,
  Aura = 30,

  Quest = 22,
  Ai = 34,
}
