import { existsSync } from 'fs';
import 'source-map-support/register.js';
import { Log } from './logger.js';
import { Diablo2PacketSniffer, findLocalIps } from './sniffer.js';

function usage(err?: string): void {
  if (err) console.log(`Error ${err} \n`);
  console.log('Usage: sniffer :network [--dump]\n');
  console.log('Network adapters:');
  console.log(
    findLocalIps()
      .map((iface) => `\t${iface.interface} (${iface.address})`)
      .join('\n'),
  );
}

async function main(): Promise<void> {
  if (process.argv.length < 3) {
    return usage();
  }
  const args = process.argv.slice(2);
  const isWriteDump = args.indexOf('--dump');
  if (isWriteDump > -1) args.splice(isWriteDump, 1);

  const localNetworks = findLocalIps();
  const networkAdapterIndex = args.findIndex((arg) => localNetworks.find((iface) => iface.interface === arg));

  if (networkAdapterIndex == null) {
    return usage('Cannot find network adapter');
  }
  const [networkAdapter] = args.splice(networkAdapterIndex, 1);
  Log.debug({ networkAdapter }, 'StartingSniffer');

  const gamePath = process.env['DIABLO2_PATH'];
  if (gamePath == null || !existsSync(gamePath)) {
    Log.error({ gamePath }, 'Path does not exist');
    return usage('Cannot find game path, set $DIABLO2_PATH');
  }

  const sniffer = new Diablo2PacketSniffer(networkAdapter, gamePath);
  sniffer.isWriteDump = isWriteDump > 0;

  await sniffer.start(Log);
}

main().catch((err) => Log.fatal({ err }, 'FailedToRun'));
