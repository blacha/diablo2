export enum UnitType {
  Player = 0,
  NPC = 1,
  GameObject = 2,
  Missile = 3,
  Item = 4,
  Warp = 5, // Room tile ?
  Invalid = 6,
  NotApplicable = 0xff,
}

export enum UnitVisibility {
  Invalid = 0, // No longer valid
  OnScreen = 1, // Displayed on screen
  InSight = 2, // Visible to the character
  InProximity = 4, // In 2-4 screen range we get notified about
}
