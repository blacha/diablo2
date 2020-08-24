import { Huffman } from '@diablo2/huffman';
import { Diablo2Packet, Diablo2PacketFactory, Diablo2ParsedPacket } from '@diablo2/packets';
import { ClientPackets } from '@diablo2/packets/build/client';
import { ServerPacketsPod } from '@diablo2/packets/build/server-pod';
import { EventEmitter } from 'events';

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

// function toHex(num: number, padding = 2): string {
//   return `0x` + num.toString(16).padStart(padding, '0');
// }

export class Diablo2GameClient {
  events = new EventEmitter();
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
    const packetSize = Huffman.getPacketSize(bytes);

    // Need more bytes
    if (packetSize > bytes.length) {
      this.inputBuffer.buffer = bytes;
      return;
    }

    const packets = Huffman.decompress(bytes);
    let offset = 0;
    while (offset < packets.length) {
      const packetId = packets[offset];
      if (packetId == 0x2b) return;
      // if (offset == packets.length - 1) break;      // Why do i need this
      const res = this.serverToClient.create(packets, offset);
      // if (this.serverToClient.count > LogStart && this.serverToClient.count < LogEnd) {
      //   if (NpcStop.is(res) || NpcMove.is(res) || NpcMoveToTarget.is(res) || WalkVerify.is(res)) {
      //     console.log(res.packet.name, res.x, res.y);
      //   } else if (NpcAssign.is(res)) {
      //     console.log(res);
      //   } else {
      //     console.log(this.serverToClient.count, {
      //       id: toHex(packets[offset]),
      //       name: this.serverToClient.packets.get(packets[offset])?.name,
      //       s: res.packet.size,
      //       o: offset,
      //       p: this.inCount,
      //     });
      //   }
      // }

      // if (res.packet.size != GSPacketSize.getPacketSize(packets.slice(offset))) {
      //   console.error(this.serverToClient.count, 'PacketSizeMissMatch', {
      //     id: toHex(packets[offset]),
      //     expected: GSPacketSize.getPacketSize(packets.slice(offset)),
      //     got: res.packet.size,
      //     packet: res,
      //   });
      //   const pktSize = offset + GSPacketSize.getPacketSize(packets.slice(offset))!;
      //   console.log(packets.slice(offset, pktSize));
      //   process.exit();
      // }

      // if (packetId == 0x96) console.log(res);

      offset += res.packet.size;

      this.events.emit(res.packet.name, res, this.serverToClient.count);
      // results.push(res);
    }

    if (packetSize < bytes.length) {
      const extraBytes = bytes.slice(packetSize);
      this.onPacketIn(extraBytes, parseCount + 1);
    }
  }

  on<T>(pkt: Diablo2Packet<T>, cb: (pkt: Diablo2ParsedPacket<T>, index: number) => void): EventEmitter {
    return this.events.on(pkt.name, cb);
  }

  //   onPacketOut(bytes: number[]) {}
}
