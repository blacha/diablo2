import { StrutParserContext, StrutType } from './type';

export class StrutTypeStringNull implements StrutType<string> {
  name = 'String';
  parse(bytes: number[], ctx: StrutParserContext) {
    const offset = ctx.offset;

    const value = [];
    let size = 0;
    for (; size + offset < bytes.length; size++) {
      const res = bytes[offset + size];
      if (res == 0) break;
      value.push(String.fromCharCode(res));
    }
    ctx.offset += size;

    return value.join('');
  }
}

export class StrutTypeStringVariable implements StrutType<string> {
  name = 'String';
  maxLength: number;
  constructor(maxLength: number) {
    this.maxLength = maxLength;
  }
  parse(bytes: number[], ctx: StrutParserContext) {
    const offset = ctx.offset;

    const value = [];
    let size = 0;
    for (; size < this.maxLength; size++) {
      const res = bytes[offset + size];
      if (res == 0) break;
      value.push(String.fromCharCode(res));
    }
    ctx.offset += this.maxLength;

    return value.join('');
  }
}
