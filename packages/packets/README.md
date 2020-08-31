# @diablo2/packets


Diablo2 packet parser

```typescript

// Path of diablo packets
import {PacketsPod} from '@diablo2/packets'

const playerInGamePacket = Buffer.from('24000100000003646364616400000000000000000000001800ffff0000000000000000', 'hex')
const player = PacketsPod.server.PlayerInGame.create(playerInGamePacket);

console.log(player);
/**
 * name: 'dcdacd'
 * level: 24
 * partyId: 65535
 * class: { id: 3, name: 'Paladin' }
 */
```