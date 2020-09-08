import { Huffman } from '@diablo2/huffman';
import { Diablo2Packet, Diablo2ParsedPacket } from '@diablo2/packets';
import { EventEmitter } from 'events';
import { Diablo2Client } from './client';

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

  onPacketIn(inBytes: Buffer, parseCount = 0): void {
    this.inPacketRawCount++;

    // Ignore this packet
    if (inBytes[0] == 0xaf && inBytes[1] == 0x01) {
      if (inBytes.length == 2) return;
      inBytes = inBytes.slice(2);
    }

    const bytes = this.inputBuffer.getBytes(inBytes);
    const packetSize = Huffman.getPacketSize(bytes);

    // Need more bytes
    if (packetSize > bytes.length) {
      this.inputBuffer.buffer = bytes;
      return;
    }

    const packets = Huffman.decompress(bytes);
    let offset = 0;
    try {
      while (offset < packets.length) {
        // TODO can we handle this packet?
        if (packets[offset] == 0x2b) break;
        const res = this.client.serverToClient.create(packets, offset);
        this.inPacketParsedCount++;
        offset += res.packet.size;
        this.events.emit('*', res);
        this.events.emit(res.packet.name, res);
      }
    } catch (e) {
      console.log(e, 'FailedToParse:Server');
    }

    // More than one compressed packet was delivered
    if (packetSize < bytes.length) {
      const extraBytes = bytes.slice(packetSize);
      this.onPacketIn(extraBytes, parseCount + 1);
    }
  }

  onPacketOut(packets: Buffer): void {
    this.outPacketRawCount++;
    let offset = 0;
    try {
      while (offset < packets.length) {
        // TODO can we handle this packet?
        if (packets[offset] == 0x2b) return;

        const res = this.client.clientToServer.create(packets, offset);
        this.outPacketParsedCount++;
        offset += res.packet.size;
        this.events.emit('*', res);
        this.events.emit(res.packet.name, res);
      }
    } catch (e) {
      console.log(e, 'FailedToParse:Client');
    }
  }

  /** On all packets being emitted */
  all(cb: (pkt: Diablo2ParsedPacket, index: number) => void): EventEmitter {
    return this.events.on('*', cb);
  }

  on<T>(pkt: Diablo2Packet<T>, cb: (pkt: Diablo2ParsedPacket<T>, index: number) => void): EventEmitter {
    return this.events.on(pkt.name, cb);
  }
}
