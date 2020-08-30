import { Diablo2Client, Diablo2GameSession } from '@diablo2/core';
import { createWriteStream, WriteStream } from 'fs';
import { networkInterfaces } from 'os';
import * as pcap from 'pcap';
import { LogType } from './logger';

export function findLocalIps(): { address: string; interface: string }[] {
  const output: { address: string; interface: string }[] = [];
  const iFaces = networkInterfaces();
  for (const [name, iFace] of Object.entries(iFaces)) {
    if (iFace == null) continue;
    for (const ifa of iFace) {
      if (ifa.family !== 'IPv4' || ifa.internal != false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        continue;
      }
      output.push({ address: ifa.address, interface: name });
    }
  }
  return output;
}
export interface PacketLine {
  direction: 'in' | 'out';
  time: number;
  bytes: string;
}

export class Diablo2PacketSniffer {
  networkAdapter: string;
  localIps: { address: string; interface: string }[];
  session: pcap.PcapSession;
  tcpTracker: any;

  /** Resolve the exit promise to exit the pcap loop */
  exitPromise: Promise<void>;
  exitPromiseResolve: () => void;
  client: Diablo2Client;

  isWriteDump = false;
  gamePath: string;

  constructor(networkAdapter: string, gamePath: string) {
    this.networkAdapter = networkAdapter;
    this.localIps = findLocalIps();
    this.tcpTracker = new pcap.TCPTracker();
    this.client = new Diablo2Client();
    this.gamePath = gamePath;
  }

  onData(
    direction: 'in' | 'out',
    data: Buffer,
    session: Diablo2GameSession,
    stream: WriteStream | null,
    log: LogType,
  ): void {
    const inputId = session.parser.inPacketRawCount;
    if (stream) {
      const logLine: PacketLine = { direction, bytes: data.toString('hex'), time: Date.now() };
      stream.write(JSON.stringify(logLine) + '\n');
    }
    try {
      session.onPacket(direction, data);
    } catch (e) {
      log.error({ inputId, outputId: session.parser.inPacketRawCount, err: e }, 'FailedToParse');
    }
  }

  async start(log: LogType): Promise<void> {
    await this.client.init(this.gamePath, log);

    this.session = pcap.createSession(this.networkAdapter, { filter: `port 4000`, buffer_timeout: 0 });

    this.tcpTracker.on('session', (session: any) => {
      const [, dstPort] = session.dst.split(':');
      const [srcHost, srcPort] = session.src.split(':');

      if (dstPort != '4000' && srcPort != '4000') {
        log.warn({ src: session.src, dst: session.dst }, 'Skipping unknown session');
        return;
      }

      const gameSession = this.client.startSession(log);
      gameSession.parser.inputBuffer.reset();
      let stream: WriteStream | null = null;
      if (this.isWriteDump) stream = createWriteStream(`./replay-${gameSession.id}.ndjson`, { flags: 'a' });

      const directions: { send: 'in' | 'out'; recv: 'in' | 'out' } = { send: 'in', recv: 'out' };
      /** is session.src really the source? */
      if (this.localIps.find((iface) => iface.address == srcHost)) {
        directions.send = 'out';
        directions.recv = 'in';
      }

      log.info({ session: gameSession.id, src: session.src, dst: session.dst }, 'Session started');

      // TODO why do I need to clone the buffer?
      // Sometime the data in the buffer is just wrong?
      session.on('data send', (session: any, bytes: Buffer) => {
        this.onData(directions.send, Buffer.from(bytes.toJSON().data), gameSession, stream, log);
      });
      session.on('data recv', (session: any, bytes: Buffer) => {
        this.onData(directions.recv, Buffer.from(bytes.toJSON().data), gameSession, stream, log);
      });

      session.on('end', () => {
        log.info({ src: session.src, dst: session.dst }, 'Session Close');
        stream?.close();
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
