import { ItemActionType } from '@diablo2/data';
import o from 'ospec';
import { ItemActionWorld } from '..';

o.spec('ItemPacket', () => {
  o('should parse a packet', () => {
    const ctx = { offset: 1, startOffset: 0 };
    const item = ItemActionWorld.parse(
      [156, 4, 29, 16, 1, 0, 0, 0, 16, 0, 128, 0, 101, 0, 16, 51, 214, 22, 3, 2, 23, 13, 0, 48, 11, 70, 128, 128, 255],
      ctx,
    );

    o(ctx.offset).equals(29);
    o(ctx.startOffset).equals(0);

    o(item.action.value).equals(ItemActionType.PutInContainer);
    o(item.action.name).equals('PutInContainer');

    o(item.category.value).equals(16);
    o(item.category.name).equals('Misc');

    console.log(item, ctx);
  });
});
