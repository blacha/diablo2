import pino from 'pino';
import { PrettyTransform } from 'pretty-json-log';
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

  const mpq = await Diablo2MpqLoader.load(process.argv[process.argv.length - 1], logger);

  logger.info({ monsters: mpq.monsters.size, lang: mpq.lang.size }, 'Mpq:Loaded');

  // if (indexOfDump > -1) {
  //   const objectsBin = await Diablo2MpqLoader.get('data/global/excel/objects.bin');
  //   if (objectsBin) await fs.writeFile('./objects.bin', objectsBin);
  // }
}

main().catch((e) => console.error(e));
