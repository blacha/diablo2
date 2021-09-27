import { MpqCompressionType } from '../const.js';
import { decompressPkWare } from './compress.pkware.js';

export function decompressSector(sector: Buffer, offset: number, size: number): Promise<Buffer> {
  const compressionType = sector[offset];

  // TODO Compressions can be stacked
  switch (compressionType) {
    case MpqCompressionType.PkWare:
      return decompressPkWare(sector, offset + 1, size - 1);
    default:
      throw new Error(`Mpq.Compression: ${MpqCompressionType[compressionType]}:${compressionType} not supported`);
  }
}
