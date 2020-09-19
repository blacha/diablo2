export enum MpqHashType {
  TableOffset = 0,
  HashA = 1,
  HashB = 2,
  Table = 3,
}

export enum MpqCompressionType {
  Huffman = 0x01,
  Zlib = 0x02,
  PkWare = 0x08,
  BZip2 = 0x10,
}

export enum MpqFlags {
  Implode = 0x00000100,
  Compressed = 0x00000200,
  Encrypted = 0x00010000,
  SingleUnit = 0x01000000,
  Crc = 0x04000000,
  Exists = 0x80000000,
}

export enum MpqFormatVersion {
  Version1 = 0,
  Version2 = 1,
  Version3 = 2,
  Version4 = 3,
}
