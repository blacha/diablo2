import { promises as fs } from 'fs';
import { FileHandle } from 'fs/promises';

export interface ProcMemoryMap {
  start: number;
  end: number;
  permissions: string;
  path?: string;
  line: string;
}

const FhCache = new Map<number, Promise<FileHandle>>();

export const Proc = {
  /** Find a pid from a process name */
  async findByName(name: string): Promise<number | null> {
    const files = await fs.readdir('/proc');
    for (const file of files) {
      const pid = Number(file);
      if (isNaN(pid)) continue;

      const data = await fs.readFile(`/proc/${file}/status`);
      const first = data.toString().split('\n')[0];
      const fileName = first.split('\t')[1];

      if (fileName.includes(name)) return pid;
    }
    return null;
  },

  /** Load the memory map */
  async loadMap(pid: number): Promise<ProcMemoryMap[]> {
    const data = await fs.readFile(`/proc/${pid}/maps`);

    const memLines = data.toString().trim().split('\n');

    const memMaps: ProcMemoryMap[] = [];
    for (const line of memLines) {
      const parts = line.split(' ');
      const [start, end] = parts[0].split('-').map((c) => parseInt(c, 16));

      const obj = {
        start,
        end,
        permissions: parts[1],
        path: parts.length > 7 ? parts[parts.length - 1] : undefined,
        line,
      };
      if (!obj.permissions.startsWith('rw')) continue;
      if (obj.path?.includes('/dev/nvidia')) continue;

      memMaps.push(obj);
    }

    return memMaps;
  },

  /**  */
  async memory(pid: number, offset: number, count: number): Promise<Buffer> {
    if (FhCache.get(pid) == null) FhCache.set(pid, fs.open(`/proc/${pid}/mem`, 'r'));
    const fh = await FhCache.get(pid);
    const buf = Buffer.alloc(count);

    const ret = await fh?.read(buf, 0, buf.length, offset);
    if (ret == null || ret.bytesRead === 0) throw new Error('Failed to read memory');
    return buf;
  },

  // /** Scan the entire memory space calling back for every offset */
  // async scan(
  //   pid: number,
  //   cb: (buf: Buffer, bufferOffset: number, offset: number, m: ProcMemoryMap) => boolean | void,
  // ): Promise<void> {
  //   const mem = await Proc.loadMap(pid);

  //   for (const m of mem) {
  //     if (m.start >= 0x7fff0000) break;
  //     const buf = await Proc.memory(pid, m.start, m.end - m.start);
  //     for (let i = 0; i < buf.length; i++) {
  //       if (cb(buf, i, i + m.start, m) === false) return;
  //     }
  //   }
  // },

  async *scan(pid: number): AsyncGenerator<{ buffer: Buffer; offset: number; map: ProcMemoryMap }> {
    const mem = await Proc.loadMap(pid);

    for (const map of mem) {
      if (map.start >= 0x7fff0000) break;
      const buffer = await Proc.memory(pid, map.start, map.end - map.start);
      yield { buffer, offset: map.start, map: map };
    }
  },
};
