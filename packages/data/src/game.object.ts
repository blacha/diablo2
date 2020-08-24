export enum GameObjectMode {
  Neutral,
  Operating,
  Opened,
  OnGround,
  InCursor,
  Dropping,
  Special4,
  Special5,
}

export enum GameObjectInteraction {
  GeneralObject = 0x00, // Stash, chests, etc.
  Well = 0x01,
  HealthShrine = 0x02,
  Unknown1 = 0x03,
  TrappedChest = 0x05,
  MonsterChest = 0x08,
  ManaShrine = 0x0d,
  StaminaShrine = 0x0e,
  ExperienceShrine = 0x0f,
  FireShrine = 0x13,
  Portal = 0x79, // Confirm... Pindle portal at least... red only ?
  LockedChest = 0x80,
}
