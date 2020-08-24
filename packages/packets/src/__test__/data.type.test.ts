import o from 'ospec';
import 'source-map-support/register';
import { StrutParserContext } from '../strutparse/type';
import { s } from '../strutparse';
import { StrutTypeArrayOffset } from '../strutparse/object';

o.spec('DataType', () => {
  let pkt: StrutParserContext;
  o.beforeEach(() => {
    pkt = { offset: 0, startOffset: 0 };
  });
  o.spec('String', () => {
    o('String:Fixed', () => {
      const res = s.string(4).parse([100, 101, 102, 80, 83, 0], pkt);
      o(res).equals('defP');
      o(pkt.offset).equals(4);
    });
    o('String:Var', () => {
      const res = s.string().parse([100, 101, 102, 80, 83, 0], pkt);
      o(res).equals('defPS');
      o(pkt.offset).equals(6);
    });
  });

  o.spec('Object', () => {
    o('should parse a object', () => {
      const obj = s.object('Test', { i8: s.i8, i16: s.i16 });
      const res = obj.parse([255, 1, 0], pkt);
      o(res).deepEquals({ i8: 255, i16: 1 });
    });
  });

  o.spec('Array', () => {
    o('should parse a array', () => {
      const obj = s.bytes(4);
      const res = obj.parse([1, 2, 3, 4], pkt);
      o(res).deepEquals([1, 2, 3, 4]);
      o(pkt.offset).equals(4);
    });

    o('should parse a var array with offset', () => {
      const obj = s.object('Obj', { len: s.offset, varArray: new StrutTypeArrayOffset(s.i8, true) });
      o(obj.parse([3, 2, 3, 4], pkt)).deepEquals({ len: 3, varArray: [2, 3] });
      o(pkt.offset).equals(3);
    });
    o('should parse a var array without offset', () => {
      const obj = s.object('Obj', { len: s.offset, varArray: new StrutTypeArrayOffset(s.i8, false) });
      o(obj.parse([3, 2, 3, 4], pkt)).deepEquals({ len: 3, varArray: [2, 3, 4] });
      o(pkt.offset).equals(4);
    });
  });

  o.spec('Int', () => {
    o('uint8', () => {
      const bytes = [100, 101, 102, 80, 83, 0];
      o(s.i8.parse(bytes, pkt)).equals(100);
      o(pkt.offset).equals(1);
      o(s.i8.parse(bytes, pkt)).equals(101);
      o(pkt.offset).equals(2);
      o(s.i8.parse(bytes, pkt)).equals(102);
      o(pkt.offset).equals(3);
      o(s.i8.parse(bytes, pkt)).equals(80);
      o(pkt.offset).equals(4);
      o(s.i8.parse(bytes, pkt)).equals(83);
      o(pkt.offset).equals(5);
    });

    o('uint16', () => {
      const bytes = [36, 0, 102, 80, 83, 0];
      o(s.i16.parse(bytes, pkt)).equals(36);
      o(pkt.offset).equals(2);
      o(s.i16.parse(bytes, pkt)).equals(20582);
      o(pkt.offset).equals(4);
    });

    o('uint32', () => {
      const bytes = [36, 0, 0, 0, 0, 0, 0, 1];
      o(s.i32.parse(bytes, pkt)).equals(36);
      o(pkt.offset).equals(4);
      o(s.i32.parse(bytes, pkt)).equals(16777216);
      o(pkt.offset).equals(8);

      o(s.i32.parse([1, 0, 0, 0], { offset: 0, startOffset: 0 })).equals(1);
      o(s.i32.parse([0, 1, 0, 0], { offset: 0, startOffset: 0 })).equals(256);
      o(s.i32.parse([0, 0, 1, 0], { offset: 0, startOffset: 0 })).equals(65536);
      o(s.i32.parse([0, 0, 0, 1], { offset: 0, startOffset: 0 })).equals(16777216);
      o(s.i32.parse([255, 255, 255, 1], { offset: 0, startOffset: 0 })).equals(33554431);
    });
  });
});
