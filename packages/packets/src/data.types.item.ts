import { D2PacketType, UInt32, UInt8 } from './data.types';
import { Diablo2ParsedPacket } from './packet';

export interface D2ItemParsed {
  action: number;
  category: number;
  itemId: number;
}

interface PacketContext {
  bytes: number[];
  offset: number;
  size: number;
  packet: Diablo2ParsedPacket;
}

function parseAndSet<T>(ctx: PacketContext, parser: D2PacketType<T>): T {
  const res = parser.parse(ctx.bytes, ctx.offset + ctx.size, ctx.packet);
  ctx.size += res.size;
  return res.value;
}

export const DataTypeItem: D2PacketType<D2ItemParsed> = {
  name: 'D2:Item',
  parse(bytes: number[], offset: number, currentPacket: Diablo2ParsedPacket): { value: D2ItemParsed; size: number } {
    const value = {} as D2ItemParsed;
    const ctx: PacketContext = { bytes, offset, size: 0, packet: currentPacket };
    value.action = parseAndSet(ctx, UInt8);
    const packetLength = parseAndSet(ctx, UInt8) - ctx.size;
    value.category = parseAndSet(ctx, UInt8);
    value.itemId = parseAndSet(ctx, UInt32);

    ctx.size = packetLength + 1;
    // console.log(currentPacket, packetLength);
    // process.exit(1)

    return { value, size: ctx.size };
  },
};
