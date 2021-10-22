import { Diablo2MpqLoader } from '@diablo2/bintools';
import { Difficulty } from '@diablo2/data';
import { bp } from 'binparse';
import 'source-map-support/register.js';
import { Diablo2Process } from './d2.js';
import { Log } from './logger.js';
import { Diablo2GameSessionMemory } from './session.js';
import { Pointer } from './struts/pointer.js';
import de from 'dotenv';

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
  if (process.argv.includes('--nightmare')) Diablo2GameSessionMemory.Difficulty = Difficulty.Nightmare;
  if (process.argv.includes('--hell')) Diablo2GameSessionMemory.Difficulty = Difficulty.Hell;
  if (process.argv.includes('--normal')) Diablo2GameSessionMemory.Difficulty = Difficulty.Normal;

  const playerName = getPlayerName();
  if (playerName == null) return usage('Missing player name');

  if (process.env['DIABLO2_PATH']) {
    await Diablo2MpqLoader.load(process.env['DIABLO2_PATH'], Log);
  }

  let proc = await Diablo2Process.find('Game.exe');
  if (proc == null || process.argv.includes('--d2r')) {
    proc = await Diablo2Process.find('D2R.exe');
    if (proc == null) throw new Error('Cannot find D2R.exe or Game.exe');

    // D2R uses 64bit pointers
    Pointer.type = bp.lu64;
  }

  Log.info({ procId: proc.process.pid }, 'Process:Found');
  const session = new Diablo2GameSessionMemory(proc, playerName);
  await session.start(Log);
}

main().catch((e) => Log.fatal(e, 'FailedToRun'));
