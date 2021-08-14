import { bp } from 'binparse';

/** Default number of idx files */
export const IdxCount = 16;

/**
 * Reading *.idx Files
 */

export const Idx = {
  header: bp.object('IdxHeader', {
    headerHashSize: bp.lu32,
    headerHash: bp.lu32,
    unk0: bp.lu16,
    bucketIndex: bp.u8,
    unk1: bp.u8,
    entrySizeBytes: bp.u8,
    offsetBytes: bp.u8,
    keyBytes: bp.u8,
    fileHeaderBytes: bp.u8,
    totalSize: bp.bytes(8),
    padding: bp.skip(8),
    entrySize: bp.lu32,
    entryHash: bp.lu32,
  }),
  entry: bp.object('IdexEntry', {
    key: bp.bytes(8),
    offset: bp.bytes(5).refine((bytes) => {
      const byteA = bytes[0] * 0x100000000;
      const byteB = bytes[1] * 0x1000000;
      const byteC = bytes[2] * 0x10000;
      const byteD = bytes[3] * 0x100;
      const byteE = bytes[4];
      const bigNumber = byteA + byteB + byteC + byteD + byteE;

      return {
        archiveNumber: bigNumber >> 30,
        offset: bigNumber & 0x3fffffff,
      };
    }),
    size: bp.lu32,
  }),
};

interface BufferLike {
  [i: number]: number;
}
/** Lookup the idx file number for a hash */
export function getIdxFileIndex(k: BufferLike): number {
  const i = k[0] ^ k[1] ^ k[2] ^ k[3] ^ k[4] ^ k[5] ^ k[6] ^ k[7] ^ k[8];
  const res = (i & 0xf) ^ (i >> 4);
  return (res + 1) % IdxCount;
}
