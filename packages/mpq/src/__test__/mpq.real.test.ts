import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import o from 'ospec';
import { Mpq } from '../mpq';

o.spec('Mpq.PatchD2', () => {
  if (!existsSync('./patch_d2.mpq')) {
    console.log('Skipping PatchMpqTests as file is missing');
    return;
  }

  const buffer = readFileSync('./patch_d2.mpq');
  const hash = createHash('sha3-224').update(buffer).digest('hex');

  if (hash !== 'e20a72b4a8e33ad846d77388bd13a50555a7eaa641d0882d4f2aef26') {
    console.log('Mpq.PatchD2: Skipping invalid file found ' + hash);
    return;
  }
  const mpq = Mpq.load(buffer);

  o('should load the mpq file', async () => {
    const header = await mpq.header;

    o(header.formatVersion).equals(0);
    o(header.archivedSize).equals(31338584);
    o(header.hashTableEntries).equals(4096);
    o(header.blockTableEntries).equals(1248);
  });

  const fileTests = [
    { name: 'data\\global\\excel\\Armor.bin', hash: '2817cb56f23ad6694d288d196491cf98bb69a4e0eb14dec19eae5de1' },
    { name: 'data\\global\\excel\\Weapons.bin', hash: 'e66a24023fc45a0829e58a3af92589801053fe1490504e4c6892156a' },
    { name: 'data/global/excel/monstats.bin', hash: '67975dc99310bdd2687f4a2d7b55305d67a41e02350b8389fac9d90e' },
    { name: 'data/global/excel/monstats2.bin', hash: '55a6dfbe672c1f61a639e5b731dfee389295b3998e3a8cbb2d4c4498' },
    { name: 'data\\global\\excel\\monstats2.bin', hash: '55a6dfbe672c1f61a639e5b731dfee389295b3998e3a8cbb2d4c4498' },
    { name: 'data/local/LNG/ENG/string.tbl', hash: '5213934be6ca14d2faa2558753a0436df5cde3a4e156574c70ba4b4f' },
    {
      name: 'data/local/LNG/ENG/expansionstring.tbl',
      hash: '2804701a166c5418f69d4c158f0b3071e88506da906fe1b349b4624f',
    },
    { name: 'data/local/LNG/ENG/patchstring.tbl', hash: '423adbffae40a7e7deb8adccfaa4a436c8a07a7976198eaa2b28613d' },
  ];

  for (const test of fileTests) {
    o(`should extract ${test.name}`, async () => {
      o(await mpq.exists(test.name)).equals(true);
      const data = await mpq.extract(test.name);
      if (data == null) throw new Error('Failed to extract: ' + test.name);
      const hash = createHash('sha3-224').update(data).digest('hex');
      o(hash).equals(test.hash);
    });
  }
});
