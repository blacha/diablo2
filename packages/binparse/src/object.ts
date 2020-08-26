import { StrutAny, StrutParserContext, StrutType, StrutInfer } from './type';

export class StrutTypeBytes implements StrutType<number[]> {
  count: number;
  name: string;

  constructor(count: number) {
    this.count = count;
    this.name = 'Bytes:' + count;
  }

  parse(bytes: number[], ctx: StrutParserContext): number[] {
    const value = bytes.slice(ctx.offset, ctx.offset + this.count);
    ctx.offset += this.count;
    return value;
  }
}

export class StrutTypeArray<T> implements StrutType<T[]> {
  count: number;
  type: StrutType<T>;
  name: string;

  constructor(type: StrutType<T>, count: number) {
    this.count = count;
    this.type = type;
    this.name = 'Array:' + this.type.name + '-' + count;
  }

  parse(bytes: number[], ctx: StrutParserContext): T[] {
    const value: T[] = [];
    for (let i = 0; i < this.count; i++) value.push(this.type.parse(bytes, ctx));
    return value;
  }
}

export class StrutTypeArrayOffsetLength implements StrutType<number> {
  name: string;
  type: StrutType<number>;
  constructor(type: StrutType<number>) {
    this.type = type;
    this.name = this.type.name + ':PacketLength';
  }
  parse(bytes: number[], pkt: StrutParserContext): number {
    const offset = pkt.offset;
    const packetLength = bytes[offset];
    pkt.packetLength = packetLength;
    pkt.offset++;
    return packetLength;
  }
}

export class StrutTypeArrayOffset<T> implements StrutType<T[]> {
  type: StrutType<T>;
  name: string;
  isMaxLength: boolean;

  constructor(name: string, type: StrutType<T>, isMaxLength: boolean) {
    this.isMaxLength = isMaxLength;
    this.type = type;
    this.name = 'Array:Offset:' + name;
  }

  parse(bytes: number[], ctx: StrutParserContext): T[] {
    const value: T[] = [];
    let packetLength = ctx.packetLength;
    if (packetLength == null) throw new Error(`${this.name}: Requires a "StrutTypeArrayOffsetLength"`);
    if (this.isMaxLength) packetLength -= ctx.offset - ctx.startOffset;
    for (let i = 0; i < packetLength; i++) value.push(this.type.parse(bytes, ctx));
    return value;
  }
}

export class StrutTypeObject<T extends Record<string, StrutAny>>
  implements StrutType<{ [K in keyof T]: StrutInfer<T[K]> }> {
  type: StrutType<T>;
  name = 'Object';
  fields: [string, StrutAny][];

  constructor(name: string, obj: T) {
    this.fields = Object.entries(obj);
    this.name = name;
  }

  create(bytes: number[]): { value: { [K in keyof T]: StrutInfer<T[K]> }; offset: number } {
    const ctx = { offset: 0, startOffset: 0 };
    const value = this.parse(bytes, ctx);
    return { value, offset: ctx.offset };
  }

  parse(bytes: number[], ctx: StrutParserContext): { [K in keyof T]: StrutInfer<T[K]> } {
    const value = {} as any;
    for (const [key, parser] of this.fields) {
      value[key] = parser.parse(bytes, ctx);
      if (ctx.offset > bytes.length) throw new Error(`${this.name}: Buffer Overflow`);
    }
    return value;
  }
}
