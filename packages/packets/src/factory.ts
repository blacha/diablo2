import { Diablo2Packet, Diablo2PacketDirection, Diablo2ParsedPacket } from './packet';
import { StrutParserContext } from 'binparse';

export function toHex(num: number, padding = 2): string {
  return `0x${num.toString(16).padStart(padding, '0')}`;
}

function isEmpty(bytes: number[] | Buffer, offset: number): boolean {
  for (let i = offset; i < bytes.length; i++) if (bytes[i] !== 0) return false;
  return true;
}

export class Diablo2PacketFactory {
  packets: Map<number, Diablo2Packet<any>> = new Map();
  direction: Diablo2PacketDirection;

  constructor(direction: Diablo2PacketDirection) {
    this.direction = direction;
  }

  register(packet: Diablo2Packet<any>): void {
    if (this.packets.has(packet.id)) {
      const existing = this.packets.get(packet.id);
      throw new Error(`Duplicate packet registered existing: ${existing?.idString} ${packet.idString}`);
    }
    this.packets.set(packet.id, packet);
  }

  create(bytes: number[] | Buffer, offset: number): Diablo2ParsedPacket {
    const packetId = bytes[offset];
    const fact = this.packets.get(packetId);
    if (fact == null) {
      // If there are just empty bytes left just swallow them up
      if (isEmpty(bytes, offset)) {
        return {
          packet: {
            id: bytes[offset],
            name: 'Empty',
            size: bytes.length - offset,
            direction: this.direction,
            bytes: bytes.slice(offset),
          },
        };
      }
      throw new Error(`Invalid packet: ${toHex(packetId)}`);
    }

    const startOffset = offset;
    const ctx: StrutParserContext = { startOffset, offset: offset + 1 };
    const packet = { id: bytes[offset], name: fact.name, size: 1 };

    const res = fact.parse(bytes, ctx);

    res.packet = packet;
    res.packet.size = ctx.offset - offset;
    res.packet.bytes = bytes.slice(ctx.startOffset, ctx.offset);
    res.packet.direction = this.direction;
    return res;
  }
}
