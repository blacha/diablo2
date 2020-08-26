import { StrutType, StrutParserContext } from './type';

export class UInt8 implements StrutType<number> {
  name = 'UInt8';
  parse(bytes: number[], pkt: StrutParserContext): number {
    const offset = pkt.offset;
    pkt.offset++;
    return bytes[offset];
  }
}

export class LUInt16 implements StrutType<number> {
  name = 'UInt16';
  parse(bytes: number[], pkt: StrutParserContext): number {
    const offset = pkt.offset;
    const byteA = bytes[offset];
    const byteB = bytes[offset + 1] << 8;
    pkt.offset += 2;
    return byteA + byteB;
  }
}
export class LUInt32 implements StrutType<number> {
  name = 'LUInt32';
  parse(bytes: number[], pkt: StrutParserContext): number {
    const offset = pkt.offset;
    const byteA = bytes[offset];
    const byteB = bytes[offset + 1] << 8;
    const byteC = bytes[offset + 2] << 16;
    const byteD = bytes[offset + 3] << 24;
    pkt.offset += 4;
    return byteA + byteB + byteC + byteD;
  }
}
