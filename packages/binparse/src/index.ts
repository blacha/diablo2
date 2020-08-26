import { StrutTypeBits } from './bits';
import { LUInt16, LUInt32, UInt8 } from './int';
import { StrutTypeLookup } from './lookup';
import { StrutTypeArrayOffset, StrutTypeArrayOffsetLength, StrutTypeBytes, StrutTypeObject } from './object';
import { StrutTypeStringFixed, StrutTypeStringNull } from './string';
import { StrutAny, StrutType } from './type';

const u8 = new UInt8();
const lu16 = new LUInt16();
const lu32 = new LUInt32();

export const bp = {
  /** Unsigned int 8  (1 byte) */
  u8,
  /** Unsigned LE int 16 (2 bytes) */
  lu16,
  /** Unsigned LE int 32 (4 bytes) */
  lu32,
  /** Empty object with nothing to parse (0 Bytes) */
  empty: new StrutTypeObject('Empty', {}),
  /** Array index, used for arrays of variable length */
  offset: new StrutTypeArrayOffsetLength(u8),
  /**
   * Read a string in
   *
   * @param length max number of bytes to read if defined, otherwise read  util finding a null
   */
  string(length?: number): StrutType<string> {
    if (length == null) return new StrutTypeStringNull();
    return new StrutTypeStringFixed(length);
  },
  /** User a bit parser to extract raw bits from the buffer */
  bits<T extends Record<string, number>>(name: string, obj: T): StrutTypeBits<T> {
    return new StrutTypeBits(name, obj);
  },
  object<T extends Record<string, StrutAny>>(name: string, obj: T): StrutTypeObject<T> {
    return new StrutTypeObject(name, obj);
  },
  /** Convert a number lookup into a human friendly output */
  lookup<T, K extends keyof T>(name: string, type: StrutType<number>, lookup: T): StrutTypeLookup<T, K> {
    return new StrutTypeLookup(name, type, lookup);
  },
  /**
   * Read a byte array
   *
   * @param count number of bytes to read
   */
  bytes(count: number): StrutType<number[]> {
    return new StrutTypeBytes(count);
  },

  /**
   * Read an array of objects, using a previously read in `offset` as the length for the array
   * @param name Name of the parser
   * @param type Type to read in
   * @param isMaxLength Is the offset length the end of the packet
   */
  arrayWithOffset<T>(name: string, type: StrutType<T>, isMaxLength: boolean): StrutTypeArrayOffset<T> {
    return new StrutTypeArrayOffset(name, type, isMaxLength);
  },
};

export { BitStream } from './bitstream';
export { StrutAny, StrutEval, StrutInfer, StrutParserContext, StrutType } from './type';
