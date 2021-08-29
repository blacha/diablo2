import { toHex } from '@diablo2/data';
import * as c from 'ansi-colors';

const charA = 'a'.charCodeAt(0);
const charZ = 'z'.charCodeAt(0);
const charCapA = 'A'.charCodeAt(0);
const charCapZ = 'Z'.charCodeAt(0);
const char0 = '0'.charCodeAt(0);
const char9 = '9'.charCodeAt(0);

function isChar(o: number): boolean {
  if (o >= charA && o <= charZ) return true;
  if (o >= charCapA && o <= charCapZ) return true;
  if (o >= char0 && o <= char9) return true;
  if (o === 0x20) return true;
  return false;
}
export function toHexColor(num: number): string {
  const str = toHex(num);
  if (num === 0) return c.gray(str);
  if (isChar(num)) {
    if (num >= char0 && num <= char9) return c.yellow(str);
    if (num === 0x20) return c.red(str);

    return c.blue(str); // String.fromCharCode(num));
  }
  return str;
}

export function dump(buf: Buffer): void {
  while (buf.length > 0) {
    const b = [...buf.slice(0, 20)];
    console.log(
      b.map((c) => toHexColor(c).padStart(4, ' ')).join(' '),
      b.map((c) => (isChar(c) ? String.fromCharCode(c) : ' ')).join(' '),
    );
    buf = buf.slice(20);
  }
}
