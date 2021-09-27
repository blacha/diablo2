import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { Mpq } from '../index.js';

const MpqFileName = './patch_d2.mpq';
async function main(): Promise<void> {
  console.time('ReadMpq');
  const fileData = await fs.readFile(MpqFileName);
  const mpqFileHash = createHash('sha256').update(fileData).digest('base64');
  const mpq = Mpq.load(fileData);
  console.timeEnd('ReadMpq');

  console.log('LoadedMPQ', MpqFileName, { hash: mpqFileHash });

  const files = [
    'data/global/excel/Armor.bin',
    'data/global/excel/Weapons.bin',
    'data/global/excel/MonStats.bin',
    'data/global/excel/MonStats2.bin',
    'data/global/excel/MonStats2.bin',
    'data/local/LNG/ENG/string.tbl',
    'data/local/LNG/ENG/expansionstring.tbl',
    'data/local/LNG/ENG/patchstring.tbl',
  ];

  for (const fileName of files) {
    const data = await mpq.extract(fileName);
    if (data == null) continue;

    const hash = createHash('sha3-224').update(data).digest('hex');
    console.log(fileName, data.length, hash);
  }
}
main().catch((e) => console.log(e));
