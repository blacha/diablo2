import { StrutAny, StrutBase, bp, StrutParserContext, StrutInfer, toHex } from 'binparse';
import { Process } from '../process.js';
import * as util from 'util';
import c from 'ansi-colors';
import { LUInt32 } from 'binparse/build/src/int';

export class PointerResult<T extends StrutAny> {
  offset: number;
  target: T;
  constructor(target: T, offset: number) {
    this.offset = offset;
    this.target = target;
  }
  get isValid(): boolean {
    if (Pointer.type.size === 4 && this.offset > 0x7fff0000) return false;
    if (Pointer.type.size === 8 && this.offset > 0x7fffffff0000) return false;
    if (this.offset < 0x00110000) return false;
    return true;
  }

  async fetch(proc: Process): Promise<T> {
    const bytes = await proc.read(this.offset, this.target.size);
    const res = this.target.raw(bytes, 0);
    return res;
  }

  [util.inspect.custom](): string {
    const validText = String(this.isValid);
    const validStr = this.isValid ? c.green(validText) : c.red(validText);
    return `{ offset: ${c.yellow(toHex(this.offset))}, valid: ${validStr} }`;
  }
}

export class Pointer<T extends StrutAny> extends StrutBase<PointerResult<T>> {
  static type = bp.lu32;
  target: T;

  constructor(target: T) {
    super('Pointer:' + target.name);
    this.target = target;
  }

  get size(): number {
    return Pointer.type.size;
  }

  /**
   *  Are all the pointer objects in this object valid
   * @returns count of pointers that are valid, 0 if there is a invalid pointer
   */
  static isPointersValid(obj: Record<string, unknown>): number {
    let pointerCount = 0;
    for (const value of Object.values(obj)) {
      if (value instanceof PointerResult) {
        if (!value.isValid) return 0;
        pointerCount++;
      }
    }
    return pointerCount;
  }

  parse(bytes: Buffer, pkt: StrutParserContext): PointerResult<T> {
    const offset = Pointer.type.parse(bytes, pkt);
    return new PointerResult(this.target, offset);
  }

  async fetch(offset: number, proc: Process): Promise<StrutInfer<T>> {
    const bytes = await proc.read(offset, this.target.size);
    return this.target.raw(bytes, 0);
  }
}
