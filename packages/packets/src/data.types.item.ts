import { s } from './strutparse';
import { StrutTypeLookup } from './strutparse/lookup';
import { StrutParserContext, StrutType } from './strutparse/type';
import { ItemActionType, ItemCategory } from '@diablo2/data';

export interface D2ItemParsed {
  action: { value: ItemActionType; name: keyof typeof ItemActionType };
  category: { value: ItemCategory; name: keyof typeof ItemCategory };
  itemId: number;
}

const StrutItemAction = new StrutTypeLookup('ItemAction', s.i8, ItemActionType);
const StrutItemCategory = new StrutTypeLookup('ItemCategory', s.i8, ItemCategory);

export const DataTypeItem: StrutType<D2ItemParsed> = {
  name: 'Item',
  parse(bytes: number[], ctx: StrutParserContext): D2ItemParsed {
    const output: Partial<D2ItemParsed> = {};
    output.action = StrutItemAction.parse(bytes, ctx);
    const packetLength = s.i8.parse(bytes, ctx);
    output.category = StrutItemCategory.parse(bytes, ctx);
    output.itemId = s.i32.parse(bytes, ctx);
    ctx.offset = ctx.startOffset + packetLength;
    return output as D2ItemParsed;
  },
};
