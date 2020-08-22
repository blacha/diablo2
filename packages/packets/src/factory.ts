import { Diablo2Packet, Diablo2ParsedPacket } from './packet';

export function toHex(num: number, padding = 2): string {
  return `0x${num.toString(16).padStart(padding, '0')}`;
}

export class Diablo2PacketFactory {
  packets: Map<number, Diablo2Packet> = new Map();

  register(packet: Diablo2Packet): void {
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
    return fact.parse(bytes, offset);
  }
}
