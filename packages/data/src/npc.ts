export interface NpcFlags {
  isNormal: boolean;
  isChampion?: boolean;
  isUnique?: boolean;
  isSuperUnique?: boolean;
  isMinion?: boolean;
  isPossessed?: boolean;
  isGhostly?: boolean;
}

export enum NpcFlag {
  None = 0,
  SuperUnique = 1 << 1,
  Champion = 1 << 2,
  Unique = 1 << 3,
  Minion = 1 << 4,
  Possessed = 1 << 5,
  Ghostly = 1 << 6,
  Multishot = 1 << 7,
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

export interface NpcResists {
  /** Raw resist to fire > 100 means immune */
  resistFire?: number;
  /** Raw resist to magic > 100 means immune */
  resistMagic?: number;
  /** Raw resist to cold > 100 means immune */
  resistCold?: number;
  /** Raw resist to poison > 100 means immune */
  resistPoison?: number;
  /** Raw resist to physical > 100 means immune */
  resistPhysical?: number;
  /** Raw resist to lightning > 100 means immune */
  resistLightning?: number;
}

/** Create a NpcFlags from a u8 encoded flags, null if no flags */
export function getNpcFlags(f: number): NpcFlags {
  if (f < 1 || f > 256) return { isNormal: true };
  const flags: NpcFlags = { isNormal: false };
  if ((f & NpcFlag.SuperUnique) === NpcFlag.SuperUnique) flags.isSuperUnique = true;
  if ((f & NpcFlag.Champion) === NpcFlag.Champion) flags.isChampion = true;
  if ((f & NpcFlag.Unique) === NpcFlag.Unique) flags.isUnique = true;
  if ((f & NpcFlag.Minion) === NpcFlag.Minion) flags.isMinion = true;
  if ((f & NpcFlag.Possessed) === NpcFlag.Possessed) flags.isPossessed = true;
  if ((f & NpcFlag.Ghostly) === NpcFlag.Ghostly) flags.isGhostly = true;
  return flags;
}
