import o from 'ospec';
import { bp } from '../index';

o.spec('Object', () => {
  o('should parse a object', () => {
    const simpleParser = bp.object('SimpleObject', {
      x: bp.lu16,
      y: bp.lu16,
    });

    const { value, offset } = simpleParser.create([0x00, 0x01, 0x01, 0x00]);
    o(offset).equals(4);
    o(value).deepEquals({ x: 256, y: 1 });
  });
});
