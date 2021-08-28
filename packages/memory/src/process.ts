import { Proc, ProcMemoryMap } from './proc';
import { StrutAny, StrutInfer, StrutTypeObject } from 'binparse';

export class ProcessMemory {
  pid: number;

  constructor(pid: number) {
    this.pid = pid;
  }

  /** Create a instance from  */
  static async fromName(name: string): Promise<ProcessMemory | null> {
    const pid = await Proc.findByName(name);
    if (pid == null) return null;
    return new ProcessMemory(pid);
  }

  async readStrut<T extends StrutAny>(offset: number, strut: T, size = strut.size): Promise<StrutInfer<T>> {
    const buf = await Proc.memory(this.pid, offset, size);
    return strut.raw(buf);
  }

  async read(offset: number, count: number): Promise<Buffer> {
    return Proc.memory(this.pid, offset, count);
  }

  async *scan(): AsyncGenerator<{ buffer: Buffer; offset: number; map: ProcMemoryMap }> {
    yield* Proc.scan(this.pid);
  }

  async strut<T extends Record<string, StrutAny>, K extends keyof T>(
    strut: StrutTypeObject<T>,
    expected: Record<K, StrutInfer<T[K]>>,
  ): Promise<{ offset: number; obj: T }[]> {
    const offsets: { offset: number; obj: T }[] = [];
    const strutSize = strut.size;

    for await (const { buffer, map } of Proc.scan(this.pid)) {
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
  }

  async text(text: string, isNullTerminated = true): Promise<number[]> {
    if (isNullTerminated) text = text + '\x00';
    const textBuffer = Buffer.from(text);
    return this.buffer(textBuffer);
  }

  async buffer(buf: Buffer): Promise<number[]> {
    const offsets: number[] = [];

    for await (const { buffer, map } of Proc.scan(this.pid)) {
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
  }
}
