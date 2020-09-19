# @diablo2/bintools

Binary file parsers for some of the `.bin` and `.tbl` files


```typescript
import {Diablo2MpqLoader} from '@diablo2/bintools'

const mpq = await Diablo2MpqLoader.load('patch_d2.mpq');

// Translate a translation key
const lang = mpq.t('7cr') // "Phase blade"

// Get information about a monster by id
const mon = mpq.monster.getMonsterName(0) // Skeleton

// Get information about super uniques
const mon = mpq.monster.getSuperUniqueName(3) // Rakanishu
```
