import { Diablo2Mpq, ItemActionType, ItemCategory, ItemContainer, ItemDestination, ItemQuality } from '@diablo2/data';
import { BitStream, bp, StrutBase, StrutInfer, StrutParserContext } from 'binparse';

export interface Diablo2Item {
  /** Game unique id for item */
  id: number;
  /** What action was performed on the item */
  action: { id: ItemActionType; name: keyof typeof ItemActionType };
  /** Item category */
  category: { id: ItemCategory; name: keyof typeof ItemCategory };

  flags: StrutInfer<typeof ItemFlags>;
  version: number;
  /** Where this item is going */
  destination: { id: ItemDestination; name: keyof typeof ItemDestination };
  /** Item destination X */
  x: number;
  /** Item destination Y */
  y: number;
  /** Item code */
  code: string;
  /** Item name (If MPQ Data is loaded) */
  name?: string;
  container?: { id: ItemContainer; name: keyof typeof ItemContainer };
  // Number of open sockets
  sockets?: number;
  socketsUsed?: number;
  level: number;
  quality: { id: ItemQuality; name: keyof typeof ItemQuality };

  /** Unique and set have extra ids */
  codeExtra?: number;

  /** Is this item a runeword */
  runeword?: { id: number; parameter: number };

  /** Item defense stat */
  defense?: number;

  durability?: { max: number; current: number };
}

/** Gold was dropped/exchanged */
export interface Diablo2ItemGold extends Diablo2Item {
  code: 'gld';
  amount: number;
}

const StrutItemAction = bp.enum('ItemAction', bp.u8, ItemActionType);
const StrutItemCategory = bp.enum('ItemCategory', bp.u8, ItemCategory);

const ItemFlags = bp.flags('ItemFlags', bp.lu32, {
  isNone: 0x0000000,
  isEquipped: 0x0000001,
  isInSocket: 0x0000008,
  isIdentified: 0x0000010,
  isSwitchedIn: 0x0000040,
  isSwitchedOut: 0x0000080,
  isBroken: 0x0000100,
  isPotion: 0x0000400,
  isSocketed: 0x0000800,
  isInStore: 0x0002000,
  isNotInSocket: 0x0004000,
  isEar: 0x0010000,
  isStartItem: 0x0020000,
  isSimpleItem: 0x0200000,
  isEthereal: 0x0400000,
  isAny: 0x0800000,
  isPersonalized: 0x1000000,
  isGamble: 0x2000000,
  isRuneWord: 0x4000000,
});

export class DataTypeItem extends StrutBase<Diablo2Item> {
  constructor() {
    super('Diablo2:Packet:Item');
  }
  parse(bytes: Buffer, ctx: StrutParserContext): Diablo2Item {
    const item: Partial<Diablo2Item> = {};
    const packetId = bytes[ctx.startOffset];

    item.action = StrutItemAction.parse(bytes, ctx);
    const packetLength = bp.u8.parse(bytes, ctx);

    // console.log(Buffer.from(bytes.slice(ctx.startOffset, ctx.startOffset + packetLength)).toString('hex'));
    item.category = StrutItemCategory.parse(bytes, ctx);
    item.id = bp.lu32.parse(bytes, ctx);

    if (packetId == 0x9d) ctx.offset += 5;

    item.flags = ItemFlags.parse(bytes, ctx);
    item.version = bp.u8.parse(bytes, ctx);

    const bits = new BitStream(bytes, ctx.offset, ctx.startOffset + packetLength);
    try {
      this.parseItemBits(bits, item as Diablo2Item);
    } catch (e) {
      console.log('FailedToParseItem', e); // Ignore
    }

    // const endOffset = ctx.startOffset + packetLength;
    ctx.offset = ctx.startOffset + packetLength;
    return item as Diablo2Item;
  }

  parseItemBits(bits: BitStream, item: Diablo2Item): void {
    bits.skip(2); // Unknown

    const destination = bits.bits(3);
    item.destination = { id: destination, name: ItemDestination[destination] as any };

    if (destination == ItemDestination.Ground) {
      item.x = bits.bits(16);
      item.y = bits.bits(16);
    } else {
      bits.bits(4);
      item.x = bits.bits(4);
      item.y = bits.bits(3);
      const containerId = bits.bits(4);
      item.container = { id: containerId, name: ItemContainer[containerId] } as any;
    }

    if (item.flags.isEar) return;
    item.code = bits.string(4).trim();

    // Lookup item name
    const mpqItem = Diablo2Mpq.items.byCode.get(item.code);
    if (mpqItem) {
      item.name = Diablo2Mpq.t(mpqItem.nameId);
    }

    if (item.code == 'gld') {
      const goldItem = item as Diablo2ItemGold;
      let readSize = 12;
      if (bits.bool()) readSize = 32;
      goldItem.amount = bits.bits(readSize);
      return;
    }

    const usedSockets = bits.bits(3);
    if (usedSockets > 0) {
      item.socketsUsed = usedSockets;
    }
    if (item.flags.isSimpleItem || item.flags.isGamble) return;
    item.level = bits.bits(7);
    const qualityId = bits.bits(4);
    item.quality = { id: qualityId, name: ItemQuality[qualityId] } as any;

    if (bits.bool()) bits.bits(3); // Has graphic
    if (bits.bool()) bits.bits(11); // Has color

    this.parsePrefixSuffix(bits, item);
  }

  parsePrefixSuffix(bits: BitStream, item: Diablo2Item): unknown {
    if (!item.flags.isIdentified) return;

    switch (item.quality.id) {
      case ItemQuality.Unique:
        if (item.code !== 'std') item.codeExtra = bits.bits(12);
        return;
      case ItemQuality.Inferior:
        bits.bits(3);
        break;
      case ItemQuality.Superior:
        bits.bits(3);
        break;
      case ItemQuality.Magic:
        bits.bits(11);
        bits.bits(11);
        break;
      case ItemQuality.Crafted:
      case ItemQuality.Rare:
        bits.bits(8);
        bits.bits(8);
        // Prefix/suffixes
        for (let i = 0; i < 3; i++) {
          if (bits.bool()) bits.bits(11);
          if (bits.bool()) bits.bits(11);
        }
        break;
      case ItemQuality.Set:
        item.codeExtra = bits.bits(12);
        break;
    }

    if (item.flags.isRuneWord) {
      item.runeword = { id: bits.bits(12), parameter: bits.bits(4) };
    }

    if (item.flags.isPersonalized) bits.string();
    if (item.category.id == ItemCategory.Armor) item.defense = bits.bits(11) - 10; // TODO why -10?

    // TODO do we care about throwables, how do we figure out if they are throwable
    // if (throwable) {
    //   bits.bits(9);
    //   bits.bits(17);
    // }

    // if (item.code == '7cr') bits.bits(8); // Why are phase blades different
    if (item.category.id == ItemCategory.Armor || item.category.id == ItemCategory.Weapon) {
      item.durability = { max: bits.bits(8), current: bits.bits(8) };
      bits.bit();
    }

    if (item.flags.isSocketed) item.sockets = bits.bits(4);
    return;
  }

  /**
   * Create a Item from a packet,
   * First byte must be either 0x9d or 0x9c
   */
  create(bytes: Buffer): Diablo2Item {
    const packetId = bytes[0];
    if (packetId !== 0x9d && packetId != 0x9c) throw new Error('Invalid packet');
    return this.parse(bytes, { startOffset: 0, offset: 1 });
  }
}
