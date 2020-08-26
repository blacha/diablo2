import { bp } from '../src/index';

const simpleParser = bp.object('SimpleObject', {
  id: bp.lu16,
  x: bp.u8,
  y: bp.u8,
});

const { value, offset } = simpleParser.create([0x01, 0x00, 0x01, 0x02]);

/** byte offset of where the reader finished */
offset; // 3

/** Parsed object */
value.id; // 0x01
value.x; // 0x01;
value.y; // 0x02
