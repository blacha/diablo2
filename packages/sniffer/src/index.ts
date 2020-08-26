import 'source-map-support/register';
import { Log } from './logger';
import { Diablo2PacketSniffer } from './sniffer';

async function main(): Promise<void> {
  if (process.argv.length != 3) {
    console.log('Usage: sniffer :network');
    return;
  }

  const networkAdapter = process.argv[2];
  Log.debug({ networkAdapter }, 'StartingSniffer');

  const sniffer = new Diablo2PacketSniffer(networkAdapter);

  await sniffer.start(Log);
}

main().catch((e) => Log.fatal(e, 'FailedToRun'));
