import { bp, StrutInfer } from 'binparse';

export const MpqHeaderReader = bp.object('MpqHeader', {
  magic: bp.string(4),
  headerSize: bp.lu32,
  archivedSize: bp.lu32,
  formatVersion: bp.lu16,
  sectorSizeShift: bp.lu16,
  hashTableOffset: bp.lu32,
  blockTableOffset: bp.lu32,
  hashTableEntries: bp.lu32,
  blockTableEntries: bp.lu32,
});

export const MpqHashTableEntry = bp.object('MpqHashTable', {
  hashA: bp.lu32,
  hashB: bp.lu32,
  locale: bp.lu16,
  platform: bp.lu16,
  blockTableIndex: bp.lu32,
});

export const MpqBlockTableEntry = bp.object('MpqBlockTable', {
  offset: bp.lu32,
  archivedSize: bp.lu32,
  size: bp.lu32,
  flags: bp.lu32,
});
export type MpqHeader = StrutInfer<typeof MpqHeaderReader>;
export type MpqHashEntry = StrutInfer<typeof MpqHashTableEntry>;
export type MpqBlockEntry = StrutInfer<typeof MpqBlockTableEntry>;
