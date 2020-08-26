import { Huffman } from '@diablo2/huffman';
import { Diablo2Packet, Diablo2ParsedPacket } from '@diablo2/packets';
import { EventEmitter } from 'events';
import { Diablo2Client } from './client';

/** Buffer packets until the required amount have been received */
export class PacketBuffer {
  static MaxBufferCount = 5;
  buffer: number[] | null = null;
  bufferCount = 0;

  reset(): void {
    this.bufferCount = 0;
    this.buffer = null;
  }

  getBytes(bytes: number[]): number[] {
    if (this.buffer == null) return bytes;

    this.bufferCount++;
    if (this.bufferCount > PacketBuffer.MaxBufferCount) {
      this.reset();
      return bytes;
    }
    const out = this.buffer.concat(bytes);
    this.buffer = null;
    return out;
  }
}

export class Diablo2PacketParser {
  events = new EventEmitter();
  inPacketRawCount = 0;
  inPacketParsedCount = 0;
  outPacketRawCount = 0;
  outPacketParsedCount = 0;
  inputBuffer = new PacketBuffer();
  client: Diablo2Client;

  constructor(client: Diablo2Client) {
    this.client = client;
  }

  onPacketIn(inBytes: number[], parseCount = 0): void {
    this.inPacketRawCount++;
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
    while (offset < packets.length) {
      // TODO can we handle this packet?
      if (packets[offset] == 0x2b) break;

      const res = this.client.serverToClient.create(packets, offset);
      this.inPacketParsedCount++;
      offset += res.packet.size;
      this.events.emit('*', res);
      this.events.emit(res.packet.name, res);
    }

    // More than one compressed packet was delivered
    if (packetSize < bytes.length) {
      const extraBytes = bytes.slice(packetSize);
      this.onPacketIn(extraBytes, parseCount + 1);
    }
  }

  onPacketOut(packets: number[]): void {
    if (packets.length > 10000) console.log('Packets');
    // this.outPacketRawCount++;
    // const offset = 0;
    // while (offset < packets.length) {
    //   const res = this.client.clientToServer.create(packets, offset);
    //   this.outPacketParsedCount++;
    //   offset += res.packet.size;
    //   this.events.emit('*', res);
    //   this.events.emit(res.packet.name, res);
    // }
  }

  on<T>(pkt: Diablo2Packet<T>, cb: (pkt: Diablo2ParsedPacket<T>, index: number) => void): EventEmitter {
    return this.events.on(pkt.name, cb);
  }
}
