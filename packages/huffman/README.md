# @diablo2/huffman

Huffman packet encoding for diablo2 network packets


```typescript
import {Huffman} from '@diablo2/huffman';

/** get total number of bytes needed to decompress  (Including the header)*/
Huffman.getPacketSize([6, 122, 4, 100, 187, 188] ) // 6

/** Get the offset to the first data byte */
Huffman.getHeaderSize([6, 122, 4, 100, 187, 188]) // 1

/** Decompress the buffer and return a new buffer */
Huffman.decompress([6, 122, 4, 100, 187, 188])
/**
[
  1, 0, 4, 8, 48,
  0, 1, 1, 0
]
*/
```
