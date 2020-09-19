import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { Mpq } from '../src';

const MpqFileName = './patch_d2.mpq';
async function main(): Promise<void> {
  console.time('ReadMpq');
  const fileData = await fs.readFile(MpqFileName);
  const mpqFileHash = createHash('sha256').update(fileData).digest('base64');
  const mpq = Mpq.load(fileData);
  console.timeEnd('ReadMpq');

  console.log('LoadedMPQ', MpqFileName, { hash: mpqFileHash });

  const files: string[] = ['patchstring.tbl', 'expansionstring.tbl', 'string.tbl'];
  for (const fileName of files) {
    console.time(`extracting:${fileName}`);
    const dat = await mpq.extract(`data\\local\\LNG\\ENG\\${fileName}`);
    console.timeEnd(`extracting:${fileName}`);
    if (dat == null) continue;

    const hash = createHash('sha1').update(dat).digest('hex');
    console.log('Extracted', { fileName, hash, size: dat.length });
  }
}
main();
