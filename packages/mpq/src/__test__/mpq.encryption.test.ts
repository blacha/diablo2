import o from 'ospec';
import { MpqEncryptionTable } from '../encryption';
import { ExpectedMpqEncryptionTable } from './mpq.encryption.table';

o.spec('MpqEncryptionTable', () => {
  o('should match provided table', () => {
    for (let i = 0; i < ExpectedMpqEncryptionTable.length; i++) {
      o(BigInt(ExpectedMpqEncryptionTable[i])).equals(MpqEncryptionTable.get(i)!);
    }
  });
});
