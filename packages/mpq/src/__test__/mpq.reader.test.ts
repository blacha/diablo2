import o from 'ospec';
import { MpqHashType } from '../const';
import { Mpq } from '../mpq';
import { MpqDecryptionTests } from './mpq.encryption.data';

o.spec('MpqReader', () => {
  const mpq = Mpq.load('foo.mpq');

  o.spec('hash', () => {
    o('should hash strings', () => {
      o(mpq.hash('hello world', MpqHashType.HashA)).equals(0xef7b1bdb);
      o(mpq.hash('HELLO world', MpqHashType.HashA)).equals(0xef7b1bdb);

      o(mpq.hash('hello world', MpqHashType.HashB)).equals(0x4ba6f4b8);
      o(mpq.hash('hello world', MpqHashType.Table)).equals(0x59c90699);
      o(mpq.hash('hello world', MpqHashType.TableOffset)).equals(0xfeb41edd);

      o(mpq.hash('(hash table)', MpqHashType.Table)).equals(0xc3af3770);
      o(mpq.hash('(block table)', MpqHashType.Table)).equals(0xec83b3a3);
      o(mpq.hash('(listfile)', MpqHashType.HashA)).equals(0xfd657910);
      o(mpq.hash('(listfile)', MpqHashType.HashB)).equals(0x4e9b98a7);

      o(mpq.hash('data\\local\\LNG\\ENG\\expansionstring.tbl', MpqHashType.HashA)).equals(0xaaf47edd);
      o(mpq.hash('data/local/LNG/ENG/expansionstring.tbl', MpqHashType.HashA)).equals(0xaaf47edd);
    });
  });

  o.spec('decryptionKey', () => {
    o('should generate decryption keys', () => {
      o(mpq.decryptionKey(`data\\global\\excel\\monstats.bin`)).equals(0xdee9de0b);
      o(mpq.decryptionKey(`data\\global\\excel\\Armor.bin`)).equals(0xfd7285c8);
      o(mpq.decryptionKey(`data\\global\\excel\\armor.bin`)).equals(0xfd7285c8);
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
