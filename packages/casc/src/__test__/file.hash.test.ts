import { fileNameHash, fileNameHashString } from '../file.hash';
import o from 'ospec';

o.spec('FileHash', () => {
  o('should calculate hashes correctly', () => {
    o(fileNameHash('data')).equals(3034860415959858194);
  });

  o('should normalise case', () => {
    o(fileNameHash('data')).equals(3034860415959858194);
    o(fileNameHash('DATA')).equals(3034860415959858194);
    o(fileNameHash('DaTa')).equals(3034860415959858194);
    o(fileNameHashString('Data')).equals('0x2a1dfd780c2e7c12');
  });

  o('should replace / with \\', () => {
    o(fileNameHash('data:data/global')).equals(8030390320118729804);
    o(fileNameHash('data:data\\global')).equals(8030390320118729804);
    o(fileNameHashString('data:data/global')).equals('0x6f71ad7306698c4c');

    o(fileNameHash('data:data\\global\\chars\\ba\\la\\balahvynustf.dcc')).equals(4906873520881998204);
    o(fileNameHashString('data:data\\global\\chars\\ba\\la\\balahvynustf.dcc')).equals('0x4418b77831f1197c');
  });
});
