import { toHex } from 'binparse';
import { readdirSync, readFileSync } from 'fs';
import * as path from 'path';
import { ItemFileParser } from '../item/item.reader';
import { LangNode, LangReader } from '../lang/lang.reader';
import { MonsterReader } from '../monster/monster.stat.reader';

const BasePath = `/home/blacha/Games/d2/game/Path of Diablo/mpq`;

const Lang = new Map<string, LangNode>();
const LangIndex: LangNode[][] = [];

async function loadLangFiles(basePath: string): Promise<void> {
  const LangPath = `${basePath}/data/local/LNG/ENG`;
  const langFiles = readdirSync(LangPath).filter((f) =>
    LangReader.LangFiles.find((lf) => f.toLowerCase().startsWith(lf)),
  );

  for (const langFile of langFiles) {
    const bytes = readFileSync(path.join(LangPath, langFile));
    console.log('Loading', langFile, toHex(bytes.length));

    console.time('Parse:' + langFile);
    const langItems = LangReader.parse(bytes);
    console.timeEnd('Parse:' + langFile);

    for (const itm of langItems) {
      Lang.set(itm.key, itm);
      if (LangIndex[itm.index]) {
        LangIndex[itm.index].push(itm);
      } else {
        LangIndex[itm.index] = [itm];
      }
    }
  }
}
const ItemFiles = new Set(['misc.bin', 'armor.bin', 'weapons.bin']);

async function loadItems(basePath: string): Promise<void> {
  const BinPath = `${basePath}/data/global/excel`;
  const fileList = readdirSync(BinPath).filter((f) => ItemFiles.has(f.toLowerCase()));
  console.log(fileList);

  for (const binFile of fileList) {
    const bytes = readFileSync(path.join(BinPath, binFile));
    console.log('Loading', binFile, toHex(bytes.length));
    console.time('Parse:' + binFile);
    const items = ItemFileParser.raw(bytes as any);
    console.timeEnd('Parse:' + binFile);

    for (const itm of items.items) {
      console.log({ code: itm.code, name: LangIndex[itm.nameLang]?.map((c) => c.value) });
    }

    // console.log(items.items.slice(0, 5));
  }
}

async function loadMonsters(basePath: string): Promise<void> {
  const BinPath = `${basePath}/data/global/excel`;
  const fileList = readdirSync(BinPath);

  const monStatFile = fileList.find((f) => f.toLowerCase() == 'monstats.bin');
  if (monStatFile) {
    const bytes = readFileSync(path.join(BinPath, monStatFile));
    console.log('Loading', monStatFile, toHex(bytes.length));
    console.time('Parse:' + monStatFile);
    MonsterReader.raw(bytes as any);
    console.timeEnd('Parse:' + monStatFile);
    // for (const mon of monsters.slice(0, 900)) {
    //   //   console.log(mon.id, LangIndex[mon.name]?.value, LangIndex[mon.description]?.value);
    // }
    // console.log(items);
  }
}

async function main() {
  await loadLangFiles(BasePath);
  await loadItems(BasePath);
  await loadMonsters(BasePath);
}

main();
