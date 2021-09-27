import 'source-map-support/register.js';
import { ItemActionType, ItemCategory, ItemDestination, ItemQuality } from '@diablo2/data';
import o from 'ospec';
import { DataTypeItem } from '../../parser.item.js';
import { ItemActionWorld } from '../server.js';

o.spec('ItemPacket', () => {
  const parser = new DataTypeItem();
  o('should parse a packet', () => {
    const ctx = { offset: 1, startOffset: 0 };
    const item = ItemActionWorld.parse(
      Buffer.from('9c041d10010000001000800065001033d6160302170d00300b468080ff', 'hex'),
      ctx,
    );

    o(ctx.offset).equals(29);
    o(ctx.startOffset).equals(0);

    o(item.action.id).equals(ItemActionType.PutInContainer);
    o(item.action.name).equals('PutInContainer');

    o(item.category.id).equals(16);
    o(item.category.name).equals('Misc');
  });

  o('should parse a 15% ed phase blase', () => {
    const item = parser.create(Buffer.from('9c021e056800000010008000658c24c2bfe2664c0e04d02100111e3cf80f', 'hex'));
    o(item.id).equals(104);
    o(item.version).equals(101);
    o(item.code).equals('7cr');
    o(item.x).equals(4388);
    o(item.y).equals(5630);
    o(item.action.id).equals(ItemActionType.DropToGround);
    o(item.category.id).equals(ItemCategory.Weapon);
    o(item.destination.id).equals(ItemDestination.Ground);
  });

  o('should parse a 2os loricated mail 438def 28/36dura', () => {
    const item = parser.create(Buffer.from('9d052001290000000001000000100880006510a05a37c60602a9001c120ef21f', 'hex'));
    o(item.code).equals('ucl');
    o(item.quality.id).equals(ItemQuality.Normal);
    o(item.sockets).equals(2);
    o(item.socketsUsed).equals(undefined);
    o(item.durability).deepEquals({ max: 36, current: 28 });
    o(item.defense).equals(438);
  });

  o('should parse skin of the viper magi', () => {
    const item = parser.create(
      Buffer.from(
        '9d083101100000000001000000100080006570068057160682de210d89c0a80001cf08e5c4528aa5154b2d96d2c8fee43f',
        'hex',
      ),
    );
    o(item.quality.id).equals(ItemQuality.Unique);
    o(item.code).equals('xea');
    o(item.level).equals(61);
    o(item.flags.isIdentified).equals(true);
  });

  o('should parse tal rune', () => {
    const item = parser.create(Buffer.from('9d1319103c00000004390000001800a0006518042007730302', 'hex'));
    o(item.code).equals('r07');
    o(item.action.id).equals(ItemActionType.ItemInSocket);
    o(item.category.id).equals(ItemCategory.Misc);
  });

  o('should parse a normal phase blase', () => {
    const item = parser.create(Buffer.from('9c021a05f503000010008000656c60223be2664c0e045501e03f', 'hex'));
    o(item.code).equals('7cr');
  });

  o('should parse map objects', () => {
    const item = parser.create(
      Buffer.from(
        '9c023f10440000001000800065cc2462c0a22dac060455e3936fb7bacc96c93208282e49a78c155750182bb6a048ab00839036031620ad062c40da0d5880ff',
        'hex',
      ),
    );

    o(item.quality.id).equals(ItemQuality.Rare);
    o(item.code).equals('ma5');
  });
});

/**
 * Drop Map
 * - exp 25%
 * - monsters  280%
 * 9c023f10440000001000800065cc2462c0a22dac060455e3936fb7bacc96c93208282e49a78c155750182bb6a048ab00839036031620ad062c40da0d5880ff
 *
 *
 * UnEquip Skin of viper magi
 * 9d083101100000000001000000100080006570068057160682de210d89c0a80001cf08e5c4528aa5154b2d96d2c8fee43f
 *
 * Put Nats helm in stash
 * 9c042e0050000000100080006500c88a8796030268e1036d40090100b408a07de8c488e1c4508aa115432d86fe03
 *
 * 3os loricated mail 438d 28 def
 * 9d052001290000000001000000100880006510a05a37c60602a9001c120ef21f
 *
 * 15% ed phase blase
 * 9c021e056800000010008000658c24c2bfe2664c0e04d02100111e3cf80f
 */
