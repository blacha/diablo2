import { StrutParserContext, StrutType } from './type';

/**
 * Variable length string that is null terminated.
 */
export class StrutTypeStringNull implements StrutType<string> {
  name = 'String';
  parse(bytes: number[], ctx: StrutParserContext): string {
    const offset = ctx.offset;

    const value = [];
    let size = 0;
    for (; size + offset < bytes.length; size++) {
      const res = bytes[offset + size];
      if (res == 0x00) break;
      value.push(String.fromCharCode(res));
    }
    ctx.offset += size + 1;

    return value.join('');
  }
}

/**
 * Fixed length string
 *
 * will stop parsing when first `0x00` is read in or
 * max length which ever is first
 */
export class StrutTypeStringFixed implements StrutType<string> {
  name = 'String';
  maxLength: number;
  constructor(maxLength: number) {
    this.maxLength = maxLength;
  }
  parse(bytes: number[], ctx: StrutParserContext): string {
    const offset = ctx.offset;

    const value = [];
    let size = 0;
    for (; size < this.maxLength; size++) {
      const res = bytes[offset + size];
      if (res == 0x00) break;
      value.push(String.fromCharCode(res));
    }
    ctx.offset += this.maxLength;

    return value.join('');
  }
}
