export const MpqEncryptionTable: number[] = [];
let seed = 0x00100001;
for (let i = 0; i < 256; i++) {
  let k = i;
  for (let j = 0; j < 5; j++) {
    seed = (seed * 125 + 3) % 0x2aaaab;
    const a = (seed & 0xffff) << 0x10;
    seed = (seed * 125 + 3) % 0x2aaaab;
    const b = seed & 0xffff;
    MpqEncryptionTable[k] = a | b;
    k += 0x100;
  }
}
