import { StrutTypeBits } from './bits';
import { UInt16, UInt32, UInt8 } from './int';
import { StrutTypeArray, StrutTypeArrayOffsetLength, StrutTypeObject } from './object';
import { StrutTypeStringNull, StrutTypeStringVariable } from './string';
import { StrutAny } from './type';

const i8 = new UInt8();
const i16 = new UInt16();
const i32 = new UInt32();

export const s = {
  i8,
  i16,
  i32,
  empty: new StrutTypeObject('Empty', {}),
  offset: new StrutTypeArrayOffsetLength(i8),
  string(len?: number) {
    if (len == null) return new StrutTypeStringNull();
    return new StrutTypeStringVariable(len);
  },
  bits: (name: string, obj: Record<string, number>) => new StrutTypeBits(name, obj),
  object: (name: string, obj: Record<string, StrutAny>) => new StrutTypeObject(name, obj),
  bytes: (count: number) => new StrutTypeArray(i8, count),
};
