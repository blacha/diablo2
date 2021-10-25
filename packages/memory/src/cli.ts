import { Diablo2MpqLoader } from '@diablo2/bintools';
import { Diablo2Version } from '@diablo2/data';
import de from 'dotenv';
import 'source-map-support/register.js';
import { Diablo2Process } from './d2.js';
import { Log } from './logger.js';
import { Diablo2GameSessionMemory } from './session.js';

de.config();

function usage(err?: string): void {
  if (err) console.log(`Error ${err} \n`);
  console.log('Usage: reader :playerName\n');
}

function getPlayerName(): string | null {
  for (let i = process.argv.length - 1; i >= 0; i--) {
    const arg = process.argv[i];
    if (arg.startsWith('-')) continue;
    return arg;
  }
  return null;
}

async function main(): Promise<void> {
  if (process.argv.length < 3) return usage();

  const playerName = getPlayerName();
  if (playerName == null) return usage('Missing player name');

  if (process.env['DIABLO2_PATH']) await Diablo2MpqLoader.load(process.env['DIABLO2_PATH'], Log);

  const proc = await Diablo2Process.find(
    process.argv.includes('--d2c') ? Diablo2Version.Classic : Diablo2Version.Resurrected,
  );

  Log.info({ procId: proc.process.pid }, 'Process:Found');
  const session = new Diablo2GameSessionMemory(proc, playerName);
  await session.start(Log);
}

main().catch((e) => Log.fatal(e, 'FailedToRun'));
