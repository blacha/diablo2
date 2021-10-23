import { Diablo2Client, Diablo2GameSession } from '@diablo2/core';
import { Diablo2Version, getDiabloVersion } from '@diablo2/data';
import { EventEmitter } from 'events';
import { networkInterfaces } from 'os';
import { LogType } from './logger.js';
import { PacketLine } from './packet.line.js';
import { AutoClosingStream } from './replay.tracker.js';
import { createRequire } from 'module';

const req = createRequire(import.meta.url);
const pcap: any = req('pcap');

export function findLocalIps(): { address: string; interface: string }[] {
  const output: { address: string; interface: string }[] = [];
  const iFaces = networkInterfaces();
  for (const [name, iFace] of Object.entries(iFaces)) {
    if (iFace == null) continue;
    for (const ifa of iFace) {
      if (ifa.family !== 'IPv4' || ifa.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        continue;
      }
      output.push({ address: ifa.address, interface: name });
    }
  }
  return output;
}

export class Diablo2PacketSniffer {
  networkAdapter: string;
  localIps: { address: string; interface: string }[];
  session: any;
  // No typings exist for this?
  tcpTracker: any;

  /** Resolve the exit promise to exit the pcap loop */
  exitPromise: Promise<void>;
  exitPromiseResolve: () => void;
  client: Diablo2Client;

  isWriteDump = false;
  gamePath: string;

  events = new EventEmitter();
  version: Diablo2Version;

  constructor(networkAdapter: string, gamePath: string) {
    this.networkAdapter = networkAdapter;
    this.localIps = findLocalIps();
    this.tcpTracker = new pcap.TCPTracker();
    this.version = getDiabloVersion(gamePath);
    this.client = new Diablo2Client(this.version);
    this.gamePath = gamePath;
  }

  /** Dump packets into a output stream if requested */
  fileStreams = new Map<string, AutoClosingStream>();
  private getTraceStream(sessionId: string): AutoClosingStream {
    let existingStream = this.fileStreams.get(sessionId);
    if (existingStream == null) {
      existingStream = new AutoClosingStream(`./packets-${new Date().toISOString().slice(0, 13)}-${sessionId}.ndjson`);
      this.fileStreams.set(sessionId, existingStream);
    }
    return existingStream;
  }

  /** When a new game session is started */
  onNewGame(cb: (game: Diablo2GameSession) => void): EventEmitter {
    return this.events.on('session', cb);
  }

  onData(direction: 'in' | 'out', data: Buffer, session: Diablo2GameSession, log: LogType): void {
    const inputId = session.parser.inPacketRawCount;
    if (this.isWriteDump) {
      const logLine: PacketLine = { direction, bytes: data.toString('hex'), time: Date.now() };
      this.getTraceStream(session.id).write(logLine);
    }
    try {
      session.onPacket(direction, data, log);
    } catch (e) {
      log.error({ inputId, outputId: session.parser.inPacketRawCount, err: e }, 'FailedToParse');
    }
  }

  _initPromise: Promise<void> | null = null;
  init(log: LogType): Promise<void> {
    if (this._initPromise == null) this._initPromise = this.client.init(this.gamePath, log);
    return this._initPromise;
  }

  async start(log: LogType): Promise<void> {
    await this.init(log);
    this.session = pcap.createSession(this.networkAdapter, { filter: `port 4000`, buffer_timeout: 0 });

    this.tcpTracker.on('session', (session: any) => {
      const [, dstPort] = session.dst.split(':');
      const [srcHost, srcPort] = session.src.split(':');

      if (dstPort !== '4000' && srcPort !== '4000') {
        log.warn({ src: session.src, dst: session.dst }, 'Skipping unknown session');
        return;
      }

      const gameSession = this.client.startSession(log);
      this.events.emit('session', gameSession);

      const directions: { send: 'in' | 'out'; recv: 'in' | 'out' } = { send: 'in', recv: 'out' };
      /** is session.src really the source? */
      if (this.localIps.find((iface) => iface.address === srcHost)) {
        directions.send = 'out';
        directions.recv = 'in';
      }

      log.info({ session: gameSession.id, src: session.src, dst: session.dst }, 'Session started');

      // TODO why do I need to clone the buffer?
      // Sometime the data in the buffer is just wrong?
      session.on('data send', (session: any, bytes: Buffer) => {
        this.onData(directions.send, Buffer.from(bytes.toJSON().data), gameSession, log);
      });
      session.on('data recv', (session: any, bytes: Buffer) => {
        this.onData(directions.recv, Buffer.from(bytes.toJSON().data), gameSession, log);
      });

      session.on('end', () => {
        gameSession.state.close();
        log.info({ src: session.src, dst: session.dst }, 'Session Close');
      });
    });

    this.session.on('packet', (rawPacket: unknown) => {
      const packet = pcap.decode.packet(rawPacket);
      this.tcpTracker.track_packet(packet);
    });

    this.exitPromise = new Promise((resolve) => (this.exitPromiseResolve = resolve));
    await this.exitPromise;
  }
}
