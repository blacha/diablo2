# @diablo2/memory

Memory reader for diablo2


```typescript
const player = await d2.scanForPlayer(this.playerName);

const act = await player.act;
const actMisc = await act.pActMisc.fetch(d2);
actMisc.mapSeed; // MapSeed

const path = await player.path;
// Player X/Y
path.x;
path.y 
```