import { Diablo2Mpq, NpcEnchant, NpcFlags } from '@diablo2/data';
import { BitStream, bp, StrutBase, StrutParserContext, toHex } from 'binparse';

const NpcEnchantsIgnore = new Set([NpcEnchant.RandomName, NpcEnchant.None, NpcEnchant.Quest, NpcEnchant.Ai]);

export interface NpcInfo {
  unitId: number;
  /** NpcId */
  code: number;
  x: number;
  y: number;
  /** Health values are 0 - 128 */
  life: number;

  /** Name of monster */
  name: string;
  flags?: NpcFlags;
  enchants?: { id: NpcEnchant; name: keyof typeof NpcEnchant }[];

  /** Was the NPC parsed successfully */
  isValid: boolean;
}

// TODO stolen (where from?)
function bitScanReverse(mask: number): { index: number; mask: number } {
  let index = 0;
  while (mask > 1) {
    mask >>= 1;
    index++;
  }
  return { index, mask };
}

export class DataTypeNpc extends StrutBase<NpcInfo> {
  constructor() {
    super('Diablo2:Packet:Npc');
  }

  get size(): number {
    throw new Error('Cannot size :' + this.name);
  }

  parse(bytes: Buffer, ctx: StrutParserContext): NpcInfo {
    const npc: Partial<NpcInfo> = {};
    const packetId = bytes[ctx.startOffset];
    if (packetId !== 0xac) throw new Error(`[${this.name}] Invalid packet: ${toHex(packetId)}`);

    npc.unitId = bp.lu32.parse(bytes, ctx);
    npc.code = bp.lu16.parse(bytes, ctx);
    npc.x = bp.lu16.parse(bytes, ctx);
    npc.y = bp.lu16.parse(bytes, ctx);
    npc.life = bp.u8.parse(bytes, ctx);

    const packetLength = bp.u8.parse(bytes, ctx);

    const mon = Diablo2Mpq.monsters.monsters.get(npc.code);
    npc.name = Diablo2Mpq.t(mon?.nameLangId) ?? 'Unknown';

    const br = new BitStream(bytes, ctx.offset, ctx.startOffset + packetLength);
    ctx.offset = ctx.startOffset + packetLength;
    if (mon == null) return npc as NpcInfo;

    br.bits(4);
    const npcStateFields = Diablo2Mpq.monsters.getState(mon.baseId);

    const hasState = br.bool();
    if (npcStateFields.length === 0) {
      if (hasState) {
        npc.isValid = false;
        console.log('Npc', npc.code, npc.name, Buffer.from(bytes.slice(ctx.startOffset, ctx.offset)).toString('hex'));
      }
      return npc as NpcInfo;
    }

    if (hasState) {
      for (const fieldSize of npcStateFields) {
        const res = bitScanReverse(fieldSize - 1);
        if (res.mask !== 1) res.index = 0;
        if (res.index === 31) res.index = 0;
        br.bits(res.index + 1);
      }
    }

    const flags: NpcFlags = {};
    npc.flags = flags;
    if (br.bool()) {
      if (br.bool()) flags.isChampion = true;
      if (br.bool()) flags.isUnique = true;
      if (br.bool()) flags.isSuperUnique = true;
      if (br.bool()) flags.isMinion = true;
      if (br.bool()) flags.isGhostly = true;
    }

    if (flags.isSuperUnique) {
      const superUniqueId = br.bits(16);
      npc.name = Diablo2Mpq.monsters.getSuperUniqueName(superUniqueId);
    }
    if (Object.keys(flags).length === 0) delete npc.flags;

    if (npc.flags?.isSuperUnique || npc.flags?.isUnique) {
      while (br.offset + 8 < br.maxOffset - 16) {
        const enchant = br.bits(8);

        if (NpcEnchantsIgnore.has(enchant)) continue;
        npc.enchants = npc.enchants ?? [];
        npc.enchants.push({ id: enchant, name: NpcEnchant[enchant] as keyof typeof NpcEnchant });
      }
    }

    return npc as NpcInfo;
  }

  /**
   * Create a Item from a packet,
   * First byte must be either 0x9d or 0x9c
   */
  create(bytes: Buffer): NpcInfo {
    return this.parse(bytes, { startOffset: 0, offset: 1 });
  }
}
