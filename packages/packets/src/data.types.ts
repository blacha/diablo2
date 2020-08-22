import { BitStream } from '@diablo2/bitstream';
import { Diablo2ParsedPacket } from './packet';

export interface D2PacketType<T> {
  name: string;
  parse(bytes: number[], offset: number, currentPacket: Diablo2ParsedPacket): { value: T; size: number };
}

type TypeOf<P> = P extends D2PacketType<infer T> ? T : never;
export type ExtractTypeOf<T> = { [C in keyof T]: TypeOf<T[C]> };

export const UInt8: D2PacketType<number> = {
  name: 'UInt8',
  parse(bytes: number[], offset: number) {
    return { value: bytes[offset], size: 1 };
  },
};
export const UInt16: D2PacketType<number> = {
  name: 'UInt16',
  parse(bytes: number[], offset: number) {
    return { value: (bytes[offset] + bytes[offset + 1]) << 8, size: 2 };
  },
};
export const UInt32: D2PacketType<number> = {
  name: 'UInt32',
  parse(bytes: number[], offset: number) {
    const value = (((bytes[offset] + bytes[offset + 1]) << (8 + bytes[offset + 2])) << (16 + bytes[offset + 3])) << 24;
    return { value, size: 4 };
  },
};

export function VariableDataArray<T>(
  type: D2PacketType<T>,
  arrayLenKey: string,
  includeOffset = true,
): D2PacketType<T[]> {
  return {
    name: 'Array:' + type.name,
    parse(bytes: number[], offset: number, currentPacket: Diablo2ParsedPacket) {
      let arrayLen = currentPacket[arrayLenKey] as number;
      if (arrayLen == null || typeof arrayLen != 'number')
        throw Error(`Unable to read array length from packet: ${arrayLenKey}`);
      // if (includeOffset) arrayLen = arrayLen - currentPacket.packet.size;
      if (includeOffset) {
        arrayLen = (arrayLen - currentPacket.packet.size) as number;
      }
      const value = [];
      let size = 0;
      for (let i = 0; i < arrayLen; i++) {
        const res = type.parse(bytes, offset + size, currentPacket);
        size += res.size;
        value.push(res.value);
      }
      return { value, size };
    },
  };
}

export function DataObject<T extends Record<string, AllDataTypes>>(name: string, obj: T): D2PacketType<T> {
  return {
    name,
    parse(bytes: number[], offset: number, currentPacket: Diablo2ParsedPacket) {
      let size = 0;
      const value = {} as any;
      for (const key of Object.keys(obj)) {
        const parser = obj[key];
        const res = parser.parse(bytes, offset + size, currentPacket);
        value[key] = res.value;
        size += res.size;
      }
      return { value, size };
    },
  };
}
export function DataBitField<T extends Record<string, number>>(name: string, obj: T): D2PacketType<T> {
  let totalBits = 0;
  const fields = Object.keys(obj);
  for (const f of fields) totalBits += obj[f];
  const bytesRequired = Math.ceil(totalBits / 8);
  return {
    name,
    parse(bytes: number[], offset: number) {
      const output = {} as any;
      const bs = new BitStream(bytes, offset, offset + bytesRequired);
      for (const f of fields) {
        const bitsRequired = obj[f] as number;
        output[f] = bs.bits(bitsRequired);
      }
      return { value: output, size: bytesRequired };
    },
  };
}

type ValueOf<T> = T[keyof T];
export function DataLookup<T>(
  name: string,
  lookup: T,
  type: D2PacketType<number>,
): D2PacketType<{ value: ValueOf<T>; name: keyof T }> {
  return {
    name: 'Lookup:' + name,
    parse(bytes: number[], offset: number, currentPacket: Diablo2ParsedPacket) {
      const res = type.parse(bytes, offset, currentPacket);
      const lookedUp = (lookup as any)[res.value] as string;
      if (lookedUp == null) throw Error('Foo');

      const outputValue = { value: res.value, name: lookedUp } as any;
      return { value: outputValue, size: res.size };
    },
  };
}

export function DataArray<T>(type: D2PacketType<T>, count: number): D2PacketType<T[]> {
  return {
    name: 'Array:' + type.name,
    parse(bytes: number[], offset: number, currentPacket: Diablo2ParsedPacket) {
      const value = [];
      let size = 0;
      for (let i = 0; i < count; i++) {
        const res = type.parse(bytes, offset + size, currentPacket);
        size += res.size;
        value.push(res.value);
      }
      return { value, size };
    },
  };
}

export function DataString(size: number): D2PacketType<string> {
  return {
    name: 'String',
    parse(bytes: number[], offset: number) {
      const value = [];
      for (let i = 0; i < size; i++) {
        const res = bytes[offset + i];
        if (res == null || res == 0) break;
        value.push(String.fromCharCode(res));
      }
      return { value: value.join(''), size };
    },
  };
}

export const CString: D2PacketType<string> = {
  name: 'String',
  parse(bytes: number[], offset: number) {
    const value = [];
    let size = 0;
    for (; size + offset < bytes.length; size++) {
      const res = bytes[offset + size];
      if (res == 0) break;
      value.push(String.fromCharCode(res));
    }
    return { value: value.join(''), size: size + 1 };
  },
};

export type AllDataTypes = D2PacketType<unknown> | D2PacketType<unknown[]>;
