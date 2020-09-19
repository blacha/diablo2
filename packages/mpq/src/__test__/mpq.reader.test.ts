import o from 'ospec';
import { MpqHashType } from '../const';
import { Mpq } from '../mpq';
import { MpqDecryptionTests } from './mpq.encryption.data';

o.spec('MpqReader', () => {
  const mpq = Mpq.load('foo.mpq');

  o.spec('hash', () => {
    o('should hash strings', () => {
      o(mpq.hash('hello world', MpqHashType.HashA).toString(16)).equals('ef7b1bdb');
      o(mpq.hash('HELLO world', MpqHashType.HashA).toString(16)).equals('ef7b1bdb');

      o(mpq.hash('hello world', MpqHashType.HashB).toString(16)).equals('4ba6f4b8');
      o(mpq.hash('hello world', MpqHashType.Table).toString(16)).equals('59c90699');
      o(mpq.hash('hello world', MpqHashType.TableOffset).toString(16)).equals('feb41edd');

      o(mpq.hash('(hash table)', MpqHashType.Table).toString(16)).equals('c3af3770');
      o(mpq.hash('(block table)', MpqHashType.Table).toString(16)).equals('ec83b3a3');
      o(mpq.hash('(listfile)', MpqHashType.HashA).toString(16)).equals('fd657910');
      o(mpq.hash('(listfile)', MpqHashType.HashB).toString(16)).equals('4e9b98a7');

      o(mpq.hash('data\\local\\LNG\\ENG\\expansionstring.tbl', MpqHashType.HashA).toString(16)).equals('aaf47edd');
    });
  });

  o.spec('decrypt', () => {
    MpqDecryptionTests.forEach((obj) => {
      o('should decrypt table: ' + obj.name, () => {
        const inputBuf = Buffer.from(obj.input, 'base64');
        mpq.decrypt(inputBuf, obj.key);
        o(inputBuf.toString('base64')).equals(obj.output);
      });
    });
  });
});
