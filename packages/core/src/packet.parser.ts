import { Logger } from '@diablo2/bintools';
import { toHex } from '@diablo2/data';
import { Huffman } from '@diablo2/huffman';
import { Diablo2Packet, Diablo2ParsedPacket } from '@diablo2/packets';
import { EventEmitter } from 'events';
import { Diablo2Client } from './client.js';

/** Buffer packets until the required amount have been received */
export class PacketBuffer {
  static MaxBufferCount = 5;
  buffer: Buffer | null = null;
  bufferCount = 0;

  reset(): void {
    this.bufferCount = 0;
    this.buffer = null;
  }

  getBytes(bytes: Buffer): Buffer {
    if (this.buffer == null) return bytes;

    this.bufferCount++;
    if (this.bufferCount > PacketBuffer.MaxBufferCount) {
      this.reset();
      return bytes;
    }
    const out = Buffer.concat([this.buffer, bytes]);
    this.buffer = null;
    return out;
  }
}

export class Diablo2PacketParser {
  /** Dump raw packets on failure */
  debugFailures = true;
  events = new EventEmitter();
  /** Number of packets received from  */
  inPacketRawCount = 0;
  /** Number of packets that have been unpacked */
  inPacketParsedCount = 0;
  /** Number of outgoing packets seen */
  outPacketRawCount = 0;
  /** Number of outgoing packets that have been unpacked */
  outPacketParsedCount = 0;
  /**
   * Incoming packets something need more data than that is in one packet
   * Buffer them and re use them
   */
  inputBuffer = new PacketBuffer();
  client: Diablo2Client;

  constructor(client: Diablo2Client) {
    this.client = client;
  }

  onPacketIn(inBytes: Buffer, log: Logger, parseCount = 0, startOffset = 0): boolean {
    this.inPacketRawCount++;

    // Ignore this packet
    if (inBytes[0] === 0xaf && inBytes[1] === 0x01) {
      if (inBytes.length === 2) return true;
      inBytes = inBytes.slice(2);
    }

    const bytes = this.inputBuffer.getBytes(inBytes);
    const packetSize = Huffman.getPacketSize(bytes);

    // Need more bytes
    if (packetSize > bytes.length) {
      this.inputBuffer.buffer = bytes;
      return true;
    }

    const packets = Huffman.decompress(bytes);
    let offset = startOffset;

    const toEmit: Diablo2ParsedPacket<unknown>[] = [];
    try {
      while (offset < packets.length) {
        // TODO can we handle this packet?
        if (packets[offset] === 0x2b) {
          log.trace({ packet: 0x2b }, 'SkipPacket');
          break;
        }

        const res = this.client.serverToClient.create(packets, offset);
        // console.log(offset, res.packet.id.toString(16), res.packet.name);

        this.inPacketParsedCount++;
        offset += res.packet.size;
        toEmit.push(res);
      }

      for (const emit of toEmit) {
        this.events.emit('*', emit);
        this.events.emit(emit.packet.name, emit);
      }
    } catch (e: any) {
      const bytesLeft = packets.length - offset;

      if (this.debugFailures) {
        console.log(Buffer.from(packets).toString('hex'), { offset, packetId: toHex(packets[offset]) });
      }
      log.warn(
        {
          packet: toHex(packets[offset]),
          left: toEmit.length,
          packets: toEmit.map((c) => c.packet.name),
          offset,
          bytesLeft,
        },
        'Packet:Failed:ServerClient:' + e.message,
      );
      return false;
    }

    // More than one compressed packet was delivered
    if (packetSize < bytes.length) {
      const extraBytes = bytes.slice(packetSize);
      return this.onPacketIn(extraBytes, log, parseCount + 1);
    }
    return true;
  }

  onPacketOut(packets: Buffer, log: Logger): boolean {
    this.outPacketRawCount++;
    let offset = 0;
    const toEmit: Diablo2ParsedPacket<unknown>[] = [];

    try {
      while (offset < packets.length) {
        const res = this.client.clientToServer.create(packets, offset);
        this.outPacketParsedCount++;
        offset += res.packet.size;
        toEmit.push(res);
      }
      for (const emit of toEmit) {
        this.events.emit('*', emit);
        this.events.emit(emit.packet.name, emit);
      }
    } catch (e) {
      const bytesLeft = packets.length - offset;
      log.warn(
        { left: toEmit.length, packets: toEmit.map((c) => c.packet.name), offset, bytesLeft },
        'Packet:Failed:ClientServer',
      );
      return false;
    }
    return true;
  }

  /** On all packets being emitted */
  all(cb: (pkt: Diablo2ParsedPacket, index: number) => void): EventEmitter {
    return this.events.on('*', cb);
  }

  on<T>(pkt: Diablo2Packet<T>, cb: (pkt: Diablo2ParsedPacket<T>, index: number) => void): EventEmitter {
    return this.events.on(pkt.name, cb);
  }
}
