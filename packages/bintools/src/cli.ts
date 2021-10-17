import pino from 'pino';
import { PrettyTransform } from 'pretty-json-log';
import { promises as fs } from 'fs';
import { Diablo2MpqLoader } from './mpq.loader.js';
const logger = process.stdout.isTTY ? pino(PrettyTransform.stream()) : pino();
logger.level = 'trace';

export async function main(): Promise<void> {
  if (process.argv.length < 3) {
    console.log('./d2-mpq :pathToGame [--dump]');
    return;
  }

  const indexOfDump = process.argv.indexOf('--dump');
  if (indexOfDump > -1) process.argv.splice(indexOfDump, indexOfDump + 1);
  console.log({ indexOfDump }, process.argv);

  const mpq = await Diablo2MpqLoader.load(process.argv[process.argv.length - 1], logger);

  if (indexOfDump > -1) {
    const objectsBin = await Diablo2MpqLoader.get('data/global/excel/objects.bin');
    if (objectsBin) await fs.writeFile('./objects.bin', objectsBin);
  }

  for (const obj of mpq.objects.values()) {
    if (obj.name.toLowerCase().includes('waypoint')) console.log(obj);
  }

  //   console.log(mpq.objects.get(13));
}

main().catch((e) => console.error(e));
