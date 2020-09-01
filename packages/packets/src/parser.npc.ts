import { BitStream, bp, StrutParserContext, StrutType, toHex } from 'binparse';
import { Diablo2Mpq } from '@diablo2/data';

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

  /** Was the NPC parsed successfully */
  isValid: boolean;
}

export interface NpcFlags {
  isChampion?: boolean;
  isUnique?: boolean;
  isSuperUnique?: boolean;
  isMinion?: boolean;
  isGhostly?: boolean;
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

export class DataTypeNpc implements StrutType<NpcInfo> {
  name = 'Npc';
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

    npc.name = Diablo2Mpq.monsters.getMonsterName(npc.code) ?? 'Unknown';

    const br = new BitStream(bytes, ctx.offset, ctx.offset + packetLength);
    // console.log(Buffer.from(bytes.slice(ctx.startOffset, ctx.offset + packetLength)).toString('hex'));
    ctx.offset = ctx.startOffset + packetLength;

    br.skip(4);

    const npcStateFields = Diablo2Mpq.monsters.getState(npc.code);
    if (npcStateFields.length == 0) {
      npc.isValid = false;
      return npc as NpcInfo;
    }

    if (br.bool()) {
      for (const fieldSize of npcStateFields) {
        const res = bitScanReverse(fieldSize - 1);
        if (res.mask !== 1) res.index = 0;
        if (res.index == 31) res.index = 0;
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
    if (Object.keys(flags).length == 0) delete npc.flags;

    // console.log('Npc', br.remainingBits, br.remainingBits / 8);

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
