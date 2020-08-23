export enum ItemActionType {
  AddToGround = 0,
  GroundToCursor = 1, // only sent if item goes to cursor (GS packet 0x0A removes item from ground)
  DropToGround = 2,
  OnGround = 3,
  PutInContainer = 4,
  RemoveFromContainer = 5,
  Equip = 6,
  /**
   *Sent for the equipped item when changing from a two handed weapon to a single handed weapon or vice versa.
   *The item must be equiped on the "empty" hand or a regular SwapBodyItem will be sent instead.
   *Empty hand meaning left hand if currently wearing a two handed weapon or the empty hand if wearing a single hand item.
   *The result will be the new item being equipped and the old going to cursor.
   */
  IndirectlySwapBodyItem = 7,
  Unequip = 8,
  SwapBodyItem = 9,
  AddQuantity = 0x0a,
  AddToShop = 0x0b,
  RemoveFromShop = 0x0c,
  SwapInContainer = 0x0d,
  PutInBelt = 0x0e,
  RemoveFromBelt = 0x0f,
  SwapInBelt = 0x10,
  /**
   *Sent for the secondary hand's item going to inventory when changing from a dual item setup to a two handed weapon.
   */
  AutoUnequip = 0x11,
  RemoveFromHireling = 0x12, // sent along with a 9d 08 packet... Also Item on cursor when entering game ?? MiscToCursor??
  ItemInSocket = 0x13,
  UNKNOWN1 = 0x14,
  UpdateStats = 0x15, // put item in socket; for each potion that drops in belt when lower one is removed...
  UNKNOWN2 = 0x16,
  WeaponSwitch = 0x17,
}

export enum ItemCategory {
  Helm = 0,
  Armor = 1,
  /** Most weapons, including Crossbows */
  Weapon = 5,
  /** Bows (not crossbows), sometimes shield (if equipped in LeftHand?) */
  Weapon2 = 6,
  /** Shields can some sometimes be Weapon2... */
  Shield = 7,
  /** Class specific items !? */
  Special = 10,
  /** BaseMiscItems and gloves, boots... */
  Misc = 16,
}
