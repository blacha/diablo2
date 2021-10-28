import { promises as fs } from 'fs';
import { FileHandle } from 'fs/promises';
import { basename } from 'path';
import { decompressPkWare } from './compression/compress.pkware.js';
import { decompressSector } from './compression/index.js';
import { MpqFlags, MpqFormatVersion, MpqHashType } from './const.js';
import { MpqEncryptionTable } from './encryption.js';
import {
  MpqBlockEntry,
  MpqBlockTableEntry,
  MpqHashEntry,
  MpqHashTableEntry,
  MpqHeader,
  MpqHeaderReader,
} from './header.js';

const charA = 'a'.charCodeAt(0);
const charZ = 'z'.charCodeAt(0);

const upperCaseChange = charA - 'A'.charCodeAt(0);

let id = 1;
export abstract class Mpq {
  /** Unique id of the MPQ since load */
  id: number;
  /** human friendly name of the MPQ */
  name: string;
  hashTable: Map<string, MpqHashEntry>;
  blockTable: MpqBlockEntry[];

  /** Create a new instance of a MPQ Reader */
  static load(file: Buffer | string, name?: string): Mpq {
    if (typeof file === 'string') return new MpqFile(file);
    return new MpqBuffer(file, name);
  }
  constructor(name?: string) {
    this.id = id++;
    this.name = name ?? `Mpq:${this.id}`;
  }

  abstract read(offset: number, byteCount: number): Promise<Buffer>;
  /** Close the file if it has been opened */
  abstract close(): Promise<void>;

  private async readHeader(): Promise<MpqHeader> {
    const headerBuf = await this.read(0, 32);
    const header = MpqHeaderReader.raw(headerBuf);

    if (header.magic !== 'MPQ\x1a') throw new Error('Only MPQ.magic 0x1a is supported');
    if (header.formatVersion !== MpqFormatVersion.Version1) throw new Error('Only MPQ.format 0x00 is supported');

    const hashTableSize = header.hashTableEntries * 16;
    const hashTableBuf = await this.read(header.hashTableOffset, hashTableSize);
    this.decrypt(hashTableBuf, this.hash(`(hash table)`, MpqHashType.Table));

    const blockTableSize = header.blockTableEntries * 16;
    const blockTableBuf = await this.read(header.blockTableOffset, blockTableSize);
    this.decrypt(blockTableBuf, this.hash(`(block table)`, MpqHashType.Table));

    const ctx = { offset: 0, startOffset: 0 };
    const blockTable: MpqBlockEntry[] = [];
    for (let i = 0; i < header.blockTableEntries; i++) blockTable.push(MpqBlockTableEntry.parse(blockTableBuf, ctx));
    this.blockTable = blockTable;

    ctx.offset = 0;
    ctx.startOffset = 0;
    const hashTable: Map<string, MpqHashEntry> = new Map();
    for (let i = 0; i < header.hashTableEntries; i++) {
      const entry = MpqHashTableEntry.parse(hashTableBuf, ctx);
      const hashKey = `${entry.hashB}.${entry.hashA}`;
      hashTable.set(hashKey, entry);
    }
    this.hashTable = hashTable;

    return header;
  }

  _header: Promise<MpqHeader> | null;
  get header(): Promise<MpqHeader> {
    if (this._header == null) this._header = this.readHeader();
    return this._header;
  }

  private async getFileEntry(fileName: string): Promise<MpqHashEntry | undefined> {
    await this.header;
    const hashA = this.hash(fileName, MpqHashType.HashA);
    const hashB = this.hash(fileName, MpqHashType.HashB);
    const hashKey = `${hashB}.${hashA}`;
    return this.hashTable.get(hashKey);
  }

  /**
   * Does a file exist inside the MPQ
   * @param fileName file tlookup
   */
  async has(fileName: string): Promise<boolean> {
    return this.getFileEntry(fileName).then((c) => c != null);
  }
  /** Alias for has(fileName) */
  exists = this.has;

  /**
   * Extract a file from the MPQ
   * @param fileName file to extract
   * @returns File buffer if it exists null other wise
   */
  async extract(fileName: string): Promise<Buffer | null> {
    const header = await this.header;
    const hashEntry = await this.getFileEntry(fileName);
    if (hashEntry == null) return null;

    const blockEntry = this.blockTable[hashEntry.blockTableIndex];

    if (blockEntry == null) return null;
    if ((blockEntry.flags & MpqFlags.Exists) === MpqFlags.Exists) return null;
    if (blockEntry.archivedSize === 0) return Buffer.alloc(0);

    const isEncrypted = (blockEntry.flags & MpqFlags.Encrypted) === MpqFlags.Encrypted;
    const isEncryptionFix = (blockEntry.flags & MpqFlags.EncryptionFix) === MpqFlags.EncryptionFix;

    // TODO Should really handle these flags
    if (blockEntry.flags & MpqFlags.SingleUnit) throw new Error('MPQ flag:SingleUnit not supported');
    if (blockEntry.flags & MpqFlags.Crc) throw new Error('MPQ flag:Crc not supported');

    let decryptionKey = -1;
    if (isEncrypted) {
      decryptionKey = this.decryptionKey(fileName);
      if (isEncryptionFix) {
        const fileKey = (BigInt(decryptionKey) + BigInt(blockEntry.offset)) ^ BigInt(blockEntry.size);
        decryptionKey = Number(fileKey);
      }
    }
    // const isCompressed = (blockEntry.flags & MpqFlags.Compressed) === MpqFlags.Compressed;
    const isImplode = (blockEntry.flags & MpqFlags.Implode) === MpqFlags.Implode;
    // const isCrcEmbedded = (blockEntry.flags & MpqFlags.Crc) === MpqFlags.Crc;

    const sectorSize = 512 << header.sectorSizeShift;
    const sectors = Math.ceil(blockEntry.size / sectorSize);

    const fileData = await this.read(blockEntry.offset, blockEntry.archivedSize);
    if (isEncrypted) this.decrypt(fileData, decryptionKey - 1, 0, (sectors + 1) * 4);

    const outputBuffer = Buffer.allocUnsafe(blockEntry.size);
    for (let i = 0; i < sectors; i++) {
      const currentOffset = fileData.readUInt32LE(i * 4);
      const nextOffset = fileData.readUInt32LE(i * 4 + 4);
      if (nextOffset < currentOffset) throw new Error('Failed to read MPQ invalid sectors detected');

      const currentSectorSize = nextOffset - currentOffset;
      if (currentSectorSize > sectorSize) throw new Error('Failed to read MPQ invalid sectors detected');
      if (currentOffset > blockEntry.archivedSize) throw new Error('Failed to read MPQ invalid sector overflow');

      // Decrypt the sector if needed
      if (isEncrypted) this.decrypt(fileData, decryptionKey + i, currentOffset, currentSectorSize);

      // If the sector is not compressed just copy it
      if (currentSectorSize === sectorSize) {
        fileData.copy(outputBuffer, i * sectorSize, currentOffset, currentOffset + sectorSize);
        continue;
      }

      if (isImplode) {
        const decompressedBytes = await decompressPkWare(fileData, currentOffset, currentSectorSize);
        decompressedBytes.copy(outputBuffer, i * sectorSize, 0, decompressedBytes.length);
      } else {
        const decompressedBytes = await decompressSector(fileData, currentOffset, currentSectorSize);
        decompressedBytes.copy(outputBuffer, i * sectorSize, 0, decompressedBytes.length);
      }
    }

    // Since we have decrypted it in place these blocks are no longer encrypted
    blockEntry.flags = blockEntry.flags & ~MpqFlags.Encrypted;
    if (outputBuffer.length !== blockEntry.size) {
      throw new Error(`Failed to decode file:"${fileName}", file size missmatch`);
    }
    return outputBuffer;
  }

  decryptionKey(str: string): number {
    let lastIndex = str.length - 1;
    for (; lastIndex >= 0; lastIndex--) {
      const ch = str.charAt(lastIndex);
      if (ch === '\\') break;
      if (ch === '/') break;
    }
    return this.hash(str.slice(lastIndex + 1), MpqHashType.Table);
  }
  /**
   * Create a MPQ hash of a string using the given mpq hash type
   * @param str String to hash
   * @param type MPQ hash type to use
   */
  hash(str: string, type: MpqHashType): number {
    // Allow the use of '/' as a path separator
    if (str.includes('/') && !str.includes('\\')) str = str.replace(/\//g, '\\');
    let seed1 = 0x7fed7fed;
    let seed2 = 0xeeeeeeee;
    for (let i = 0; i < str.length; i++) {
      let ch = str.charCodeAt(i);
      // upper case lowercase characters
      if (ch >= charA && ch < charZ) ch -= upperCaseChange;
      const value = MpqEncryptionTable[(type << 8) + ch];
      seed1 = value ^ (seed1 + seed2);
      seed2 = ch + seed1 + seed2 + (seed2 << 5) + 3;
    }
    return seed1 >>> 0;
  }
  /**
   * Decrypt MPQ data
   * @param data buffer of data needing to be decrypted
   * @param key key to use to decrypt the buffer
   */
  decrypt(data: Buffer, key: number, offset = 0, size = data.length): void {
    let hash = key;
    let seed = 0xeeeeeeee;

    for (let i = 0; i < size; i += 4) {
      seed += MpqEncryptionTable[0x400 + (hash & 0xff)];
      let value = data.readUInt32LE(offset);
      value = (value ^ (hash + seed)) >>> 0;

      data.writeUInt32LE(value, offset);
      offset += 4;

      hash = ((~hash << 0x15) + 0x11111111) | (hash >>> 0x0b);
      seed = value + seed + (seed << 5) + 3;
    }
  }
}

/**
 * MPQ loaded from a file
 * Reading only the bytes needed to process the mpq
 * Good for large MPQ files
 */
export class MpqFile extends Mpq {
  fileName: string;
  constructor(fileName: string) {
    super(basename(fileName));
    this.fileName = fileName;
  }

  _fd: Promise<FileHandle>;
  get fd(): Promise<FileHandle> {
    if (this._fd == null) this._fd = fs.open(this.fileName, 'r');
    return this._fd;
  }

  async close(): Promise<void> {
    if (this._fd) return this._fd.then((c) => c.close());
  }

  async read(offset: number, byteCount: number): Promise<Buffer> {
    const outputBuf = Buffer.allocUnsafe(byteCount);
    const fd = await this.fd;
    await fd.read(outputBuf, 0, byteCount, offset);
    return outputBuf;
  }
}

/**
 * MPQ reader from memory
 * Fast for small MPQ Files and for files that are already in memory
 */
export class MpqBuffer extends Mpq {
  buffer: Buffer;
  constructor(buffer: Buffer, name?: string) {
    super(name);
    this.buffer = buffer;
  }

  async close(): Promise<void> {
    // Noop
  }

  async read(offset: number, byteCount: number): Promise<Buffer> {
    return this.buffer.slice(offset, offset + byteCount);
  }
}
