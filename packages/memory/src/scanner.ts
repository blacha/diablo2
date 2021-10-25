import { StrutAny, StrutInfer, StrutTypeObject } from 'binparse';
import { Pointer } from './index.js';
import { Process } from './process.js';

export const Scanner = {
  async *strut<T extends Record<string, StrutAny>, K extends keyof T>(
    proc: Process,
    strut: StrutTypeObject<T>,
    expected: Record<K, StrutInfer<T[K]>>,
  ): AsyncGenerator<{ offset: number; obj: T }> {
    const strutSize = strut.size;

    for await (const { buffer, map } of proc.scan()) {
      for (let i = 0; i < buffer.length; i++) {
        const bytesLeft = buffer.byteLength - i;
        if (bytesLeft < strutSize) break;

        const ctx = { startOffset: i, offset: i };
        let matches = true;
        for (const { key, parser } of strut.fields) {
          const ret = parser.parse(buffer, ctx);
          const val = expected[key as unknown as K];
          if (val === undefined) continue;
          if (ret !== val) {
            matches = false;
            break;
          }
        }
        if (matches === true) yield { offset: map.start + i, obj: strut.raw(buffer, i) };
      }
    }
  },

  async *pointerNear(proc: Process, num: number, range: number): AsyncGenerator<number> {
    const minRange = num - range;
    const maxRange = num + range;
    for await (const { buffer, map } of proc.scan()) {
      for (let i = 0; i < buffer.length - 3; i++) {
        if (buffer[i + 4] !== 0) continue;
        const val = buffer.readUInt32LE(i);

        if (val < minRange) continue;
        if (val > maxRange) continue;
        yield map.start + i;
      }
    }
  },

  async *text(proc: Process, text: string, length?: number, isNullTerminated = true): AsyncGenerator<number> {
    if (isNullTerminated) text = text + '\x00';
    if (length) text = text.padEnd(length, '\x00');
    const textBuffer = Buffer.from(text);
    yield* Scanner.buffer(proc, textBuffer);
  },

  async *buffer(proc: Process, buf: Buffer): AsyncGenerator<number> {
    for await (const { buffer, map } of proc.scan()) {
      for (const off of ScannerBuffer.buffer(buffer, buf)) yield map.start + off;
    }
  },
};

export const ScannerBuffer = {
  lu32(offset: number): Buffer {
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(offset);
    return buf;
  },
  lu64(offset: number): Buffer {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64LE(BigInt(offset));
    return buf;
  },

  *pointer(buffer: Buffer, offset: number): Generator<number> {
    const scanFor = Pointer.type.size === 4 ? ScannerBuffer.lu32(offset) : ScannerBuffer.lu64(offset);
    yield* this.buffer(buffer, scanFor);
  },

  *text(buf: Buffer, text: string, length?: number, isNullTerminated = true): Generator<number> {
    if (isNullTerminated) text = text + '\x00';
    if (length) text = text.padEnd(length, '\x00');
    const textBuffer = Buffer.from(text);
    yield* ScannerBuffer.buffer(buf, textBuffer);
  },

  *buffer(buffer: Buffer, scanFor: Buffer): Generator<number> {
    for (let i = 0; i < buffer.length; i++) {
      const bytesLeft = buffer.length - i;
      if (bytesLeft < scanFor.length) continue;

      let matches = true;
      for (let j = 0; j < scanFor.length; j++) {
        if (buffer[i + j] !== scanFor[j]) {
          matches = false;
          break;
        }
      }
      if (matches === true) yield i;
    }
  },
};
