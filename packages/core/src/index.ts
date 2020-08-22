import { Huffman } from '@diablo2/huffman';
import { Diablo2PacketFactory } from '@diablo2/packets';
import { ClientPackets } from '@diablo2/packets/build/client';
import { ServerPacketsPod } from '@diablo2/packets/build/server-pod';
import { GSPacketSize } from './packet.size';

export class PacketBuffer {
  static MaxBufferCount = 5;
  buffer: number[] | null = null;
  bufferCount = 0;

  reset() {
    this.bufferCount = 0;
    this.buffer = null;
  }

  getBytes(bytes: number[]) {
    if (this.buffer == null) return bytes;

    this.bufferCount++;
    if (this.bufferCount > PacketBuffer.MaxBufferCount) {
      this.reset();
      return bytes;
    }
    return this.buffer.concat(bytes);
  }
}

function toHex(num: number, padding = 2): string {
  return `0x` + num.toString(16).padStart(padding, '0');
}

export class Diablo2GameClient {
  clientToServer = new Diablo2PacketFactory();
  serverToClient = new Diablo2PacketFactory();

  inputBuffer = new PacketBuffer();

  constructor() {
    for (const packet of ClientPackets) this.clientToServer.register(packet);
    for (const packet of ServerPacketsPod) this.serverToClient.register(packet);
  }

  onPacketIn(inBytes: number[]) {
    if (inBytes[0] == 0xaf && inBytes[1] == 0x01) {
      if (inBytes.length == 2) return;
      inBytes = inBytes.slice(2);
    }
    console.log('\tInput:', inBytes.map((c) => toHex(c)).join(', '));
    const bytes = this.inputBuffer.getBytes(inBytes);
    const packetInfo = Huffman.getPacketInfo(bytes);
    const requiredBytes = packetInfo.length + packetInfo.offset;

    // Need more bytes
    if (requiredBytes > bytes.length) {
      this.inputBuffer.buffer = bytes;
      return;
    }
    if (requiredBytes < bytes.length) console.log('ExtraBytes');

    const packets = Huffman.decompress(bytes, packetInfo.offset, requiredBytes);

    const results = [];
    let offset = 0;
    while (offset < packets.length) {
      if (results.length > 4) break;

      const res = this.serverToClient.create(packets, offset);
      console.log({
        id: toHex(packets[offset]),
        name: this.serverToClient.packets.get(packets[offset])?.name,
        size: res.packet.size,
      });
      console.log(packets[offset], { offset, totalLen: packets.length, value: res });
      if (res.packet.size != GSPacketSize.getPacketSize(packets.slice(offset))) {
        console.error('PacketSizeMissMatch', {
          expected: GSPacketSize.getPacketSize(packets.slice(offset)),
          got: res.packet.size,
        });
        break;
      }
      offset += res.packet.size;

      //   this.emit(res);
      results.push(res);
    }
  }

  //   emit(packet: Diablo2ParsedPacket) {}

  //   onPacketOut(bytes: number[]) {}
}
