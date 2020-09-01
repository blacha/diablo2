# @diablo2/bintools

Binary file parsers for some of the `.bin` or `.tbl` files

This currently requires the MPQ to be extracted using something like `smpq` with a diablo2 list file


```typescript
import {Diablo2MpqLoader} from '@diablo2/bintools'

const mpq = await Diablo2MpqLoader.load('Path/To/Extracted/Mpq');

// Translate a translation key
const lang = mpq.t('7cr') // "Phase blade"

// Get information about a monster by id
const mon = mpq.monster.getMonsterName(0) // Skeleton

// Get information about super uniques
const mon = mpq.monster.getSuperUniqueName(3) // Rakanishu

```
