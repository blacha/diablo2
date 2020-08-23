import { Diablo2Packet, Diablo2ParsedPacket } from './packet';
import { StrutParserContext } from './strutparse/type';

export function toHex(num: number, padding = 2): string {
  return `0x${num.toString(16).padStart(padding, '0')}`;
}

export class Diablo2PacketFactory {
  packets: Map<number, Diablo2Packet<any>> = new Map();
  count = 0;

  register(packet: Diablo2Packet<any>): void {
    if (this.packets.has(packet.id)) {
      const existing = this.packets.get(packet.id);
      throw new Error(`Duplicate packet registered existing: ${existing?.idString} ${packet.idString}`);
    }
    this.packets.set(packet.id, packet);
  }

  create(bytes: number[], offset: number): Diablo2ParsedPacket {
    const packetId = bytes[offset];
    const fact = this.packets.get(packetId);
    if (fact == null) throw new Error(`Invalid packet: ${toHex(packetId)}`);
    this.count++;

    const startOffset = offset;
    const ctx: StrutParserContext = { startOffset, offset: offset + 1 };
    const packet = { id: bytes[offset], name: fact.name, size: 1, offset: offset + 1 };

    const res = fact.parse(bytes, ctx);

    res.packet = packet;
    res.packet.size = ctx.offset - offset;
    return res;
  }
}
