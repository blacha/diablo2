import { networkInterfaces } from 'os';
import * as pcap from 'pcap';
import { LogType } from './logger';
import { Diablo2Client } from '@diablo2/core';
import { PacketsPod } from '@diablo2/packets/build/packets-pod';

function findLocalIps(): string[] {
  const output: string[] = [];
  const iFaces = networkInterfaces();
  for (const [, iFace] of Object.entries(iFaces)) {
    if (iFace == null) continue;
    for (const ifa of iFace) {
      if (ifa.family !== 'IPv4' || ifa.internal != false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        continue;
      }
      output.push(ifa.address);
    }
  }
  return output;
}
export class Diablo2PacketSniffer {
  networkAdapter: string;
  localIps: string[];
  session: pcap.PcapSession;
  tcpTracker: any;

  /** Resolve the exit promise to exit the pcap loop */
  exitPromise: Promise<void>;
  exitPromiseResolve: () => void;
  client: Diablo2Client;

  constructor(networkAdapter: string) {
    this.networkAdapter = networkAdapter;
    this.localIps = findLocalIps();
    this.tcpTracker = new pcap.TCPTracker();
    this.client = new Diablo2Client(PacketsPod);
  }

  async start(log: LogType): Promise<void> {
    this.session = pcap.createSession(this.networkAdapter, { filter: `port 4000`, buffer_timeout: 0 });

    this.tcpTracker.on('session', (session: any) => {
      const dstPort = session.dst.split(':').pop();
      const srcPort = session.src.split(':').pop();

      if (dstPort != '4000' && srcPort != '4000') {
        log.warn({ src: session.src, dst: session.dst }, 'Skipping unknown session');
        return;
      }

      const gameSession = this.client.startSession();
      /** is session.src really the source? */
      const isSrcServer = srcPort == '4000';
      log.info({ src: session.src, dst: session.dst, isSrcServer }, 'Session started');

      session.on('data send', (session: any, data: any) => {
        log.info({ src: session.src, dst: session.dst }, 'data-send');

        try {
          if (isSrcServer) {
            gameSession.parser.onPacketIn(data);
          } else {
            gameSession.parser.onPacketOut(data);
          }
        } catch (e) {
          console.log(e.message);
        }
      });
      session.on('data recv', (session: any, data: any) => {
        log.info({ src: session.src, dst: session.dst }, 'data-recv');

        if (isSrcServer) {
          gameSession.parser.onPacketOut(data);
        } else {
          gameSession.parser.onPacketIn(data);
        }
      });

      session.on('end', () => {
        log.info({ src: session.src, dst: session.dst }, 'Session Close');
      });
    });

    this.session.on('packet', (rawPacket) => {
      const packet = pcap.decode.packet(rawPacket);
      this.tcpTracker.track_packet(packet);
    });

    this.exitPromise = new Promise((resolve) => (this.exitPromiseResolve = resolve));
    await this.exitPromise;
  }
}
