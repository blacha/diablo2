import { s } from './strutparse';
import { StrutAny, StrutInfer, StrutParserContext, StrutType } from './strutparse/type';

export interface Diablo2ParsedPacketInfo {
  packet: {
    id: number;
    name: string;
    offset: number;
    size: number;
  };
}

export type Diablo2ParsedPacket<T = Record<string, unknown>> = Diablo2ParsedPacketInfo & T;

export class Diablo2Packet<T> {
  name: string;
  id: number;
  parser: StrutType<T>;

  constructor(id: number, name: string, parser: StrutType<T>) {
    this.id = id;
    this.name = name;
    this.parser = parser;
  }

  static create<T extends Record<string, StrutAny>>(
    id: number,
    name: string,
    obj: T,
  ): Diablo2Packet<{ [K in keyof T]: StrutInfer<T[K]> }> {
    return new Diablo2Packet(id, name, s.object(name, obj));
  }

  static empty(id: number, name: string): Diablo2Packet<unknown> {
    return new Diablo2Packet(id, name, s.empty);
  }

  get idHex(): string {
    return '0x' + this.id.toString(16).padStart(2, '0');
  }

  idString(): string {
    return `<Packet ${this.name}: ${this.idHex}>`;
  }

  parse(bytes: number[], ctx: StrutParserContext): T {
    return this.parser.parse(bytes, ctx);
  }
}
