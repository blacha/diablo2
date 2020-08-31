# @diablo2/bintools

Binary file parsers for some of the `.bin` or `.tbl` files

This currently requires the MPQ to be extracted using something like `smpq` with a diablo2 list file


```typescript
import {Diablo2Mpq} from '@diablo2/bintools'

const mpq = await Diablo2Mpq.create('PathToExtractedMpq');

// Translate a translation key
const lang = mpq.t('7cr') // "Phase blade"

// Get information about a monster by id
const mon = mpq.monster.get(0) // Skeleton
```
