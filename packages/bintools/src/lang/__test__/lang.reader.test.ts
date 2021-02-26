import { promises as fs } from 'fs';
import o from 'ospec';
import { LangReader } from '../lang.reader';

o.spec('LangReader', () => {
  o('should read v1 language tables', async () => {
    const patchString = await fs.readFile('./data/patchstring.tbl');

    const res = LangReader.parse(patchString, { offset: 0, startOffset: 0 });

    o(res.count).equals(1179);
    o(res.indexes.length).equals(1179);

    o(res.countHash).equals(1181);
    o(res.hashTable.length).equals(1181);

    o(res.hashTable[6].key).equals('D2bnetHelp13c');
    o(res.hashTable[6].value).equals('/reply');
    o(res.hashTable[6].valueLength).equals('/reply'.length + 1);
  });
});
