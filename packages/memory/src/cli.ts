import { Diablo2MpqLoader } from '@diablo2/bintools';
import { Difficulty } from '@diablo2/data';
import { bp } from 'binparse';
import 'source-map-support/register.js';
import { Diablo2Process, Diablo2Version } from './d2.js';
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

async function findProcess(version: Diablo2Version): Promise<Diablo2Process> {
  if (version === Diablo2Version.Resurrected) Pointer.type = bp.lu64;
  if (version === Diablo2Version.Classic) Pointer.type = bp.lu32;

  const proc = await Diablo2Process.find(version);
  if (proc == null) throw new Error('Cannot find Game.exe');
  return proc;
}

async function main(): Promise<void> {
  if (process.argv.length < 3) return usage();
  if (process.argv.includes('--nightmare')) Diablo2GameSessionMemory.Difficulty = Difficulty.Nightmare;
  if (process.argv.includes('--hell')) Diablo2GameSessionMemory.Difficulty = Difficulty.Hell;
  if (process.argv.includes('--normal')) Diablo2GameSessionMemory.Difficulty = Difficulty.Normal;

  const playerName = getPlayerName();
  if (playerName == null) return usage('Missing player name');

  if (process.env['DIABLO2_PATH']) await Diablo2MpqLoader.load(process.env['DIABLO2_PATH'], Log);

  const proc = await findProcess(process.argv.includes('--d2c') ? Diablo2Version.Classic : Diablo2Version.Resurrected);

  Log.info({ procId: proc.process.pid }, 'Process:Found');
  const session = new Diablo2GameSessionMemory(proc, playerName);
  await session.start(Log);
}

main().catch((e) => Log.fatal(e, 'FailedToRun'));
