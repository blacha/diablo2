import { toHex } from './factory';
import { bp, StrutAny, StrutInfer, StrutParserContext, StrutType } from 'binparse';

export interface Diablo2ParsedPacketInfo {
  packet: {
    /** PacketId */
    id: number;
    /** Human friend name of packet */
    name: string;
    /** Number of bytes needed to read in packet */
    size: number;
  };
}
export interface Diablo2Packets {
  /** Packets going client -> server */
  client: Diablo2Packet<any>[];
  /** Packets going server -> client */
  server: Diablo2Packet<any>[];
}

export type Diablo2ParsedPacket<T = Record<string, unknown>> = Diablo2ParsedPacketInfo & T;

export class Diablo2Packet<T extends Record<string, any>> {
  name: string;
  id: number;
  parser: StrutType<T>;

  constructor(id: number, name: string, parser: StrutType<T>) {
    this.id = id;
    this.name = name;
    this.parser = parser;
  }

  is(pkt: Diablo2ParsedPacket): pkt is Diablo2ParsedPacket<T> {
    return pkt.packet.id == this.id;
  }

  static create<T extends Record<string, StrutAny>>(
    id: number,
    name: string,
    obj: T,
  ): Diablo2Packet<{ [K in keyof T]: StrutInfer<T[K]> }> {
    return new Diablo2Packet(id, name, bp.object(name, obj));
  }

  static bits<T extends Record<string, number>>(id: number, name: string, obj: T): Diablo2Packet<T> {
    return new Diablo2Packet(id, name, bp.bits(name, obj));
  }

  static empty(id: number, name: string): Diablo2Packet<any> {
    return new Diablo2Packet(id, name, bp.empty);
  }

  /** Hex */
  get idHex(): string {
    return toHex(this.id);
  }

  get idString(): string {
    return `<Packet ${this.name}: ${this.idHex}>`;
  }

  /** Create a packet from the buffer, first byte is packet id */
  raw(bytes: Buffer | number[]): T {
    return this.create(bytes).value;
  }

  /** Create a packet from the buffer, first byte is packet id */
  create(bytes: Buffer | number[]): { value: T; size: number } {
    const ctx = { offset: 1, startOffset: 0 };
    const packetId = bytes[0];
    if (packetId !== this.id) throw new Error(`[${this.name}] Unable to create packet, invalid id: ${toHex(packetId)}`);
    const value = this.parse(bytes, ctx);
    return { value, size: ctx.offset };
  }

  parse(bytes: Buffer | number[], ctx?: StrutParserContext): T {
    if (ctx == null) ctx = { offset: 0, startOffset: 0 };
    return this.parser.parse(bytes, ctx);
  }
}
