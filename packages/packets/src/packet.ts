import { toHex } from './factory';
import { s } from './strutparse';
import { StrutAny, StrutInfer, StrutParserContext, StrutType } from './strutparse/type';

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
    return new Diablo2Packet(id, name, s.object(name, obj));
  }

  static bits<T extends Record<string, number>>(id: number, name: string, obj: T): Diablo2Packet<T> {
    return new Diablo2Packet(id, name, s.bits(name, obj));
  }

  static empty(id: number, name: string): Diablo2Packet<any> {
    return new Diablo2Packet(id, name, s.empty);
  }

  /** Hex */
  get idHex(): string {
    return toHex(this.id);
  }

  get idString(): string {
    return `<Packet ${this.name}: ${this.idHex}>`;
  }

  parse(bytes: number[], ctx: StrutParserContext): T {
    return this.parser.parse(bytes, ctx);
  }
}
