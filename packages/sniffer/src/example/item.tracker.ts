import { Diablo2GameSession } from '@diablo2/core';
import { ItemActionType, ItemQuality } from '@diablo2/data';
import { PacketsPod } from '@diablo2/packets';
import { Log } from '../logger';

const GoodItems = new Set(['cx8', 'cm1', 'cm2', 'cm3']);
/** Track all items dropped onto the ground */
export function sniffItems(game: Diablo2GameSession): void {
  game.parser.on(PacketsPod.server.ItemActionWorld, (item) => {
    // Ignore items being moved around
    if (item.action.id !== ItemActionType.AddToGround) return;
    // Ignore gold
    if (item.code == 'gld') return;
    // Ignore things like scrolls/ health potion
    if (item.flags.isSimpleItem) return;

    const obj = JSON.parse(JSON.stringify({ sockets: item.sockets, quality: item.quality?.name, def: item.defense }));
    const logObj = { code: item.code, item: item.name, ...obj };
    if (GoodItems.has(item.code)) {
      Log.warn(logObj, 'ItemDropped');
      return;
    }
    switch (item.quality.id) {
      case ItemQuality.Inferior:
      case ItemQuality.Normal:
      case ItemQuality.Superior:
      case ItemQuality.Magic:
      case ItemQuality.Rare:
        Log.trace(logObj, 'ItemDropped');
        break;
      case ItemQuality.Set:
        Log.warn(logObj, 'ItemDropped');
        break;
      case ItemQuality.Unique:
        Log.warn(logObj, 'ItemDropped');
        break;
    }
  });
}
