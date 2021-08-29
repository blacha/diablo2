import { StrutAny, StrutInfer, StrutTypeObject } from 'binparse';
import { Process } from './process';

export const Scanner = {
  async strut<T extends Record<string, StrutAny>, K extends keyof T>(
    proc: Process,
    strut: StrutTypeObject<T>,
    expected: Record<K, StrutInfer<T[K]>>,
  ): Promise<{ offset: number; obj: T }[]> {
    const offsets: { offset: number; obj: T }[] = [];
    const strutSize = strut.size;

    for await (const { buffer, map } of proc.scan()) {
      for (let i = 0; i < buffer.length; i++) {
        const bytesLeft = buffer.byteLength - i;
        if (bytesLeft < strutSize) break;

        const ctx = { startOffset: i, offset: i };
        let matches = true;
        for (const [name, parser] of strut.fields) {
          const ret = parser.parse(buffer, ctx);
          const val = expected[name as unknown as K];
          if (val === undefined) continue;
          if (ret !== val) {
            matches = false;
            break;
          }
        }
        if (matches === true) offsets.push({ offset: map.start + i, obj: strut.raw(buffer, i) });
      }
    }
    return offsets;
  },

  async text(proc: Process, text: string, isNullTerminated = true): Promise<number[]> {
    if (isNullTerminated) text = text + '\x00';
    const textBuffer = Buffer.from(text);
    return Scanner.buffer(proc, textBuffer);
  },
  async textFixed(proc: Process, text: string, length: number): Promise<number[]> {
    text = text.padEnd(length, '\x00');
    const textBuffer = Buffer.from(text);
    return Scanner.buffer(proc, textBuffer);
  },

  async buffer(proc: Process, buf: Buffer): Promise<number[]> {
    const offsets: number[] = [];

    for await (const { buffer, map } of proc.scan()) {
      for (let i = 0; i < buffer.length; i++) {
        const bytesLeft = buffer.byteLength - i;
        if (bytesLeft < buf.length) continue;

        let matches = true;
        for (let j = 0; j < buf.length; j++) {
          if (buffer[i + j] !== buf[j]) {
            matches = false;
            break;
          }
        }
        if (matches === true) offsets.push(map.start + i);
      }
    }
    return offsets;
  },
};
