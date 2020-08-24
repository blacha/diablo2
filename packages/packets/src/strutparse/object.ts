import { StrutAny, StrutParserContext, StrutType, StrutInfer } from './type';

export class StrutTypeArray<T> implements StrutType<T[]> {
  count: number;
  type: StrutType<T>;
  name: string;

  constructor(type: StrutType<T>, count: number) {
    this.count = count;
    this.type = type;
    this.name = 'Array:' + this.type.name + '-' + count;
  }

  parse(bytes: number[], ctx: StrutParserContext) {
    const value = [];
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

  constructor(type: StrutType<T>, isMaxLength: boolean) {
    this.isMaxLength = isMaxLength;
    this.type = type;
    this.name = 'Array:' + this.type.name;
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

  parse(bytes: number[], ctx: StrutParserContext) {
    const value = {} as any;
    for (const [key, parser] of this.fields) {
      value[key] = parser.parse(bytes, ctx);
      if (ctx.offset > bytes.length) throw new Error(`${this.name}: Buffer Overflow`);
    }
    return value;
  }
}
