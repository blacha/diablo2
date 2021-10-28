import { toHex } from 'binparse';
import o from 'ospec';
import { MpqEncryptionTable } from '../encryption.js';
import { ExpectedMpqEncryptionTable } from './mpq.encryption.table.js';

o.spec('MpqEncryptionTable', () => {
  o('should match provided table', () => {
    for (let i = 0; i < ExpectedMpqEncryptionTable.length; i++) {
      o(ExpectedMpqEncryptionTable[i]).equals(toHex(MpqEncryptionTable[i] >>> 0));
    }
  });
});
