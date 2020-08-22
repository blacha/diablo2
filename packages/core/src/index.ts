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
    const out = this.buffer.concat(bytes);
    this.buffer = null;
    return out;
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

  inCount = 0;
  onPacketIn(inBytes: number[], parseCount = 0) {
    this.inCount++;
    if (inBytes[0] == 0xaf && inBytes[1] == 0x01) {
      if (inBytes.length == 2) return;
      inBytes = inBytes.slice(2);
    }
    const bytes = this.inputBuffer.getBytes(inBytes);
    const packetInfo = Huffman.getPacketInfo(bytes);
    const requiredBytes = packetInfo.length + packetInfo.offset;
    // console.log('\tInput:', this.inCount, packetInfo.length, bytes.length, requiredBytes); //inBytes.map((c) => '0x' + c.toString(16).padStart(2, '0')).join(', '));

    // Need more bytes
    if (requiredBytes > bytes.length) {
      this.inputBuffer.buffer = bytes;
      return;
    }

    const packets = Huffman.decompress(bytes, packetInfo.offset, packetInfo.length);
    // console.log('\t', inBytes.length, inBytes, packets.length, packetInfo.offset + requiredBytes)

    console.log('Amount', packets.length, {
      len: bytes.length,
      req: packetInfo.length + packetInfo.offset,
      info: packetInfo,
    });

    const results = [];
    let offset = 0;
    while (offset < packets.length) {
      // if (offset == packets.length - 1) break;      // Why do i need this
      const res = this.serverToClient.create(packets, offset);
      console.log(this.serverToClient.count + 1, {
        id: toHex(packets[offset]),
        name: this.serverToClient.packets.get(packets[offset])?.name,
        s: res.packet.size,
        o: offset + res.packet.size,
        p: this.inCount,
      });

      //   console.log(packets[offset], { offset, totalLen: packets.length, value: res });
      if (res.packet.size != GSPacketSize.getPacketSize(packets.slice(offset))) {
        console.error('PacketSizeMissMatch', {
          expected: GSPacketSize.getPacketSize(packets.slice(offset)),
          got: res.packet.size,
        });
        process.exit();
      }

      offset += res.packet.size;

      //   this.emit(res);
      results.push(res);
    }

    if (requiredBytes < bytes.length) {
      const extraBytes = bytes.slice(requiredBytes);

      console.log('ExtraBytes', extraBytes);
      this.onPacketIn(extraBytes, parseCount + 1);
    }
  }

  //   emit(packet: Diablo2ParsedPacket) {}

  //   onPacketOut(bytes: number[]) {}
}
