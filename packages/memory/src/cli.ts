import 'source-map-support/register';
import { Diablo2Player, Diablo2Process } from './d2';
import { Log } from './logger';
import { Diablo2GameSessionMemory } from './session';
import { StatStrut, UnitAnyPlayerStrut } from './structures';

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

  const d2Player = new Diablo2Player(proc, 0x6f7ea14 - 16);
  const player = await d2Player.player;
  console.log(player);
  const stats = await player.pStats.fetch(proc.process);
  console.log(stats);

  console.time('RestStats');
  console.log(await d2Player.stats);
  console.timeEnd('RestStats');
  // await session.start(Log);
}

main().catch((e) => Log.fatal(e, 'FailedToRun'));
