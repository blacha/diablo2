const p2: number[] = [];
for (let i = 0; i < 64; i++) {
  p2[i] = Math.pow(2, i);
}

export class BitStream {
  offset: number;
  buffer: number[];
  maxOffset: number;
  constructor(buffer: number[], offset: number, maxOffset: number) {
    this.buffer = buffer;
    this.offset = offset * 8;
    this.maxOffset = maxOffset * 8;
  }

  get remainingBits() {
    return this.maxOffset - this.offset;
  }

  getBitValue(byte: number, offset: number, length: number): number {
    return (byte & (((1 << (offset + length)) - 1) & ~((1 << offset) - 1))) >> offset;
  }

  bit(): number {
    const bytePos = Math.floor(this.offset / 8);
    const bitPos = this.offset % 8;
    const byte = this.buffer[bytePos];
    if (this.remainingBits < 0) {
      throw new Error('Overflow ' + this.remainingBits);
    }

    this.offset++;
    return this.getBitValue(byte, bitPos, 1);
  }

  /** Read bits little endian */
  bits(length: number): number {
    const initialLen = length;
    let bits = 0;
    while (length > 0) {
      bits += (this.bit() ? 1 : 0) * p2[initialLen - length];
      length -= 1;
    }
    return bits;
  }
}
