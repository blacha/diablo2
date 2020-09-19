## @diablo2/mpq

MPQ Reader for diablo2

Supports decoding PKWARE compression


```typescript

import {Mpq} from '@diablo2/mpq'

// Read from file
const mpq = Mpq.load('patch_d2.mpq');
const lang = await mpq.extract('data\\local\\LNG\\ENG\\patchstring.tbl');


// Read from buffer
const mpqBuf = await fs.promises.read('patch_d2.mpq');
const mpq = Mpq.load(mpqBuf);
const lang = await mpq.extract('data\\local\\LNG\\ENG\\patchstring.tbl');
```