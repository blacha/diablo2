import { bp } from 'binparse';
import { StrutTypeStringFixed } from 'binparse/build/src/string.js';
import { StrutParserContext, StrutParserInput } from 'binparse/build/src/type.js';

/**
 * Generally item codes are its 3 letters plus a space eg `cap `
 * Using ItemCode trims the text to just the three letters
 */
export class ItemCodeParser extends StrutTypeStringFixed {
  parse(bytes: StrutParserInput, ctx: StrutParserContext): string {
    const res = super.parse(bytes, ctx);
    return res.trim();
  }
}
const ItemCode = new ItemCodeParser(4);

const Item = bp.object('Item', {
  name: bp.string(32),
  files: bp.object('ItemFiles', {
    normal: bp.string(32),
    unique: bp.string(32),
    set: bp.string(32),
  }),
  /**
   *  2 letter code for the item
   */
  code: ItemCode,
  codes: bp.object('ItemCodes', {
    normal: ItemCode,
    unique: ItemCode,
    set: ItemCode,
  }),
  altGfx: bp.string(4),
  unk1: bp.skip(40),
  betterGem: bp.string(4),
  weaponClass: bp.lu32,
  weaponClass2Hand: bp.lu32,
  transmogrify: bp.lu32,
  minAc: bp.lu32,
  maxAc: bp.lu32,
  gambleCost: bp.lu32,
  speed: bp.lu32,
  bitField1: bp.lu32,
  cost: bp.lu32,
  minStack: bp.lu32,
  maxStack: bp.lu32,
  spawnStack: bp.lu32,
  gemOffset: bp.lu32,
  /** Lang Id for the item name */
  nameId: bp.lu16,

  unk2: bp.skip(220 - 13 * 4 - 2),
  upgrade: bp.object('ItemUpgrades', {
    nightmare: ItemCode,
    hell: ItemCode,
  }),
  unk3: bp.skip(4),
});

export const ItemFileParser = bp.object('Items', {
  count: bp.lu32,
  items: bp.array('Items', Item, 'count'),
});
