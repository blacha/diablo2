import { bp, StrutInfer } from 'binparse';

const HashNode = bp.object('HashNode', {
  /** Is the record active, generally "1" */
  active: bp.u8,
  index: bp.lu16,
  hash: bp.lu32,
  /** Offset to the lang key */
  key: bp.offset(bp.lu32, bp.string()),
  /** Offset to the lang value */
  value: bp.offset(bp.lu32, bp.string()),
  /** Length of the value, includes null byte */
  valueLength: bp.lu16,
});

const LangFileParser = bp.object('Lang', {
  crc: bp.lu16,
  /** Number of records */
  count: bp.lu16,
  /** Number of records in hash table */
  countHash: bp.variable('hash', bp.lu32),
  /** Table version generally 0 */
  version: bp.u8,
  /** Offset to the first data record */
  dataOffset: bp.lu32,
  /** Max number of collisions for string key search based on its hash value */
  maxTries: bp.lu32,
  /** File size in bytes */
  fileSize: bp.lu32,
  /** Hash table index */
  indexes: bp.array('HashIndex', bp.lu16, 'hash'),
  /** Hash table containing all the key value pairs */
  hashTable: bp.array('HashTable', HashNode, 'hash'),
});

export type LangNode = StrutInfer<typeof HashNode>;

export const LangReader = {
  LangFiles: ['string.tbl', 'expansionstring.tbl', 'patchstring.tbl'],
  parse(langBuffer: Buffer): StrutInfer<typeof HashNode>[] {
    const tbl = LangFileParser.raw((langBuffer as unknown) as number[]);
    if (tbl.fileSize !== langBuffer.byteLength) {
      throw new Error('Failed to parse lang tbl header');
    }
    return tbl.hashTable;
  },
};
