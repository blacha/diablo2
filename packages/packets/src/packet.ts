import { AllDataTypes, D2PacketType, ExtractTypeOf } from './data.types';

export interface Diablo2ParsedPacket extends Record<string, unknown> {
  packet: {
    id: number;
    name: string;
    size: number;
  };
}

export class Diablo2Packet<T extends Record<string, AllDataTypes> = Record<string, AllDataTypes>> {
  name: string;
  id: number;
  parser: { key: string; type: D2PacketType<unknown> }[];

  constructor(id: number, name: string, parser: T) {
    this.id = id;
    this.name = name;
    this.parser = Object.keys(parser).map((key) => {
      return { key, type: parser[key] };
    });
  }

  get idHex() {
    return '0x' + this.id.toString(16).padStart(2, '0');
  }
  get idString() {
    return `<Packet ${this.name}: ${this.idHex}>`;
  }

  parse(bytes: number[], offset: number): ExtractTypeOf<T> & Diablo2ParsedPacket {
    const packet = { id: bytes[offset], name: this.name, size: 1 };
    const value = { packet } as any;
    for (const p of this.parser) {
      const output = p.type.parse(bytes, offset + packet.size, value);
      if (offset + packet.size > bytes.length) {
        throw new Error(`ParseOverflow: ${this.idString} bytes: ${offset + packet.size} > ${bytes.length}`);
      }
      packet.size += output.size;
      value[p.key] = output.value;
    }
    return value;
  }
}
