export const MpqEncryptionTable = new Map<number, bigint>();

const mulA = BigInt(125);
const addA = BigInt(3);
const modA = BigInt(0x2aaaab);
const modB = BigInt(0xffff);
const shiftA = BigInt(0x10);
let seed = BigInt(0x00100001);
for (let i = 0; i < 256; i++) {
  let index = i;
  for (let j = 0; j < 5; j++) {
    seed = (seed * mulA + addA) % modA;
    const temp1 = (seed & modB) << shiftA;

    seed = (seed * mulA + addA) % modA;
    const temp2 = seed & modB;
    MpqEncryptionTable.set(index, temp1 | temp2);
    index += 0x100;
  }
}
