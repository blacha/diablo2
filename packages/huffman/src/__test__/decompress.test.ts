import o from 'ospec';
import { Huffman } from './../index.js';

const PacketDataRaw = `8a8CyEODRn35rWxlBuZHZfCshXMkoE52PBDDuBVAdGjXNK2MsEYiBINj48h+XRuPQqkIPZgYhpRA
VQBuaJ+aVsZYIRECQbHx5QpQfSAKBDDuBVAG5obc0rYyyCEQJAeHx5QpYAgqrR7bAqgaNDfmkgIy
yKDlEHR9cCyEADnHvzVGtQDKWkK0HJshDkAxDmAY3IxGDAMS1WDUHwCnKJbKIgFILQoAWZI5oR+g
OOcSAjKcTtENh9cCzJHNCR0BxziQEZThc7RC2fXAshDo0Db35rWxlFNAaBIKyJdInhOLQ8ohdC6K
AFkIeGgb+/Na2MoVCMdl8KyFcHoFhNEonFk+AczHpMGAUAKoA3NDnmlbGWmA0VhvRLpDmOgsLQsC
gBVA0aKOaSARjLGseUIen1wLIQ+NDr35rWxlQGq0PAcoVxbAIunIQhDQjBCEoZAxBRJAYjoCqBQa
HfNK2MsDoiBINj48mCcHzSEnCsYgVbAqRmjQOOaICAjKjQrUIkn1wKkZo0DnmiAgIyoyMtQiSfXA
qRmjQOuaSAjKjNlqEST64FSM0aB3zSQEZUahahEk+uA=`.replace(/[\n ]/g, '');
const PacketData = Buffer.from(PacketDataRaw, 'base64');

o.spec('Huffman', () => {
  o('should decompress single header', () => {
    const res = Huffman.decompress([6, 122, 4, 100, 187, 188]);
    o(res).deepEquals([1, 0, 4, 8, 48, 0, 1, 1, 0]);

    const headerSize = Huffman.getHeaderSize([6]);
    o(headerSize).equals(1);

    const packetSize = Huffman.getPacketSize([6]);
    o(packetSize).equals(6);
  });

  o('should decompress large buffer', () => {
    const packetSize = Huffman.getPacketSize([241, 175]);
    const headerSize = Huffman.getHeaderSize([241, 175]);
    o(packetSize).equals(431);
    o(headerSize).equals(2);

    const res = Huffman.decompress(PacketData);
    o(res[0]).equals(157);
    o(res[res.length - 1]).equals(2);
    o(res.length).equals(509);
  });
});
