import 'source-map-support/register';
import { Diablo2Process } from './d2';
import { Log } from './logger';
import { Diablo2GameSessionMemory } from './session';

function usage(err?: string): void {
  if (err) console.log(`Error ${err} \n`);
  console.log('Usage: reader :playerName\n');
}

async function main(): Promise<void> {
  if (process.argv.length < 3) {
    return usage();
  }
  const playerName = process.argv.slice(2).pop();
  if (playerName == null) return usage('Missing player name');

  const proc = await Diablo2Process.find();
  if (proc == null) return;

  const session = new Diablo2GameSessionMemory(proc, playerName);
  await session.start(Log);
}

main().catch((e) => Log.fatal(e, 'FailedToRun'));
