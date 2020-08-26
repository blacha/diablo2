import { bp, StrutParserContext, StrutType } from 'binparse';
import { ItemActionType, ItemCategory } from '@diablo2/data';

export interface D2ItemParsed {
  action: { value: ItemActionType; name: keyof typeof ItemActionType };
  category: { value: ItemCategory; name: keyof typeof ItemCategory };
  itemId: number;
}

const StrutItemAction = bp.lookup('ItemAction', bp.u8, ItemActionType);
const StrutItemCategory = bp.lookup('ItemCategory', bp.u8, ItemCategory);

export const DataTypeItem: StrutType<D2ItemParsed> = {
  name: 'Item',
  parse(bytes: number[], ctx: StrutParserContext): D2ItemParsed {
    const output: Partial<D2ItemParsed> = {};
    output.action = StrutItemAction.parse(bytes, ctx);
    const packetLength = bp.u8.parse(bytes, ctx);
    output.category = StrutItemCategory.parse(bytes, ctx);
    output.itemId = bp.lu32.parse(bytes, ctx);
    ctx.offset = ctx.startOffset + packetLength;
    return output as D2ItemParsed;
  },
};
