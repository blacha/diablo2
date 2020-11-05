import { Diablo2Packet } from '../packet';
import { bp } from 'binparse';
import { DataPlayerClass } from './data';

const DataTypePoint = { x: bp.lu16, y: bp.lu16 };
const DataTypeEntity = { type: bp.lu32, entityId: bp.lu32 };

/** Packets sent by the D2Client */
const ClientWalkToCoOrd = Diablo2Packet.create(0x01, 'ClientWalkToCoOrd', DataTypePoint);
const ClientWalkToUnit = Diablo2Packet.create(0x02, 'ClientWalkToUnit', DataTypeEntity);
const ClientRunToCoOrd = Diablo2Packet.create(0x03, 'ClientRunToCoOrd', DataTypePoint);
const ClientRunToUnit = Diablo2Packet.create(0x04, 'ClientRunToUnit', DataTypeEntity);
const ClientSkillLeft = Diablo2Packet.create(0x05, 'ClientSkillLeft', DataTypePoint);
const ClientSkillLeftOnEntity = Diablo2Packet.create(0x06, 'ClientSkillLeftOnEntity', {});
const ClientSkillLeftOnEntityEx = Diablo2Packet.create(0x07, 'ClientSkillLeftOnEntityEx', DataTypeEntity);
const ClientSkillLeftOnLocationEx = Diablo2Packet.create(0x08, 'ClientSkillLeftOnLocationEx', DataTypePoint);
const ClientSkillLeftOnEntityEx2 = Diablo2Packet.create(0x09, 'ClientSkillLeftOnEntityEx2', DataTypeEntity);
const ClientSkillLeftOnEntityEx3 = Diablo2Packet.create(0x0a, 'ClientSkillLeftOnEntityEx3', DataTypeEntity);
const ClientSkillUnk1 = Diablo2Packet.empty(0x0b, 'ClientSkillUnk1');
const ClientSkillRight = Diablo2Packet.create(0x0c, 'ClientSkillRight', DataTypePoint);
const ClientSkillRightEntity = Diablo2Packet.create(0x0d, 'ClientSkillRightEntity', DataTypeEntity);
const ClientSkillRightEntityEx = Diablo2Packet.create(0x0e, 'ClientSkillRightEntityEx', DataTypeEntity);
const ClientSkillRightEntityEx2 = Diablo2Packet.create(0x10, 'ClientSkillRightEntityEx2', DataTypeEntity);
const ClientSkillRightEntityEx3 = Diablo2Packet.create(0x11, 'ClientSkillRightEntityEx3', DataTypeEntity);
const ClientSkillRightEx = Diablo2Packet.create(0x0f, 'ClientSkillRightEx', DataTypePoint);
const ClientSkillUnk2 = Diablo2Packet.empty(0x12, 'ClientSkillUnk2');
const ClientInteractEntity = Diablo2Packet.create(0x13, 'ClientInteractEntity', DataTypeEntity);
const ClientOverHeadMessage = Diablo2Packet.create(0x14, 'ClientOverHeadMessage', {
  unk1: bp.lu16,
  message: bp.string(),
  unk2: bp.u8,
  unk3: bp.lu16,
});
const ClientChatMessage = Diablo2Packet.create(0x15, 'ClientChatMessage', {
  type: bp.u8,
  unk1: bp.u8,
  message: bp.string(),
  unk2: bp.lu16,
});
const ClientItemPickup = Diablo2Packet.create(0x16, 'ClientItemPickup', {
  unitType: bp.lu32,
  unitId: bp.lu32,
  actionId: bp.lu32,
});
const ClientItemDrop = Diablo2Packet.create(0x17, 'ClientItemDrop', { itemId: bp.lu32 });
const ClientItemToCursor = Diablo2Packet.create(0x18, 'ClientItemToCursor', {
  itemId: bp.lu32,
  x: bp.lu32,
  y: bp.lu32,
  bufferType: bp.lu32,
});
const ClientItemPickupToCursor = Diablo2Packet.create(0x19, 'ClientItemPickupToCursor', { itemId: bp.lu32 });
const ClientItemToBody = Diablo2Packet.create(0x1a, 'ClientItemToBody', { itemId: bp.lu32, bodyLocation: bp.lu32 });
const ClientItemSwap2Hand = Diablo2Packet.create(0x1b, 'ClientItemSwap2Hand', {
  itemId: bp.lu32,
  bodyLocation: bp.lu32,
});
const ClientItemPickupBody = Diablo2Packet.create(0x1c, 'ClientItemPickupBody', { bodyLocation: bp.lu16 });
const ClientBodySwitch = Diablo2Packet.create(0x1d, 'ClientBodySwitch', {
  itemId: bp.lu32,
  bodyLocation: bp.lu32,
});
const ClientBodySwitch2 = Diablo2Packet.create(0x1e, 'ClientBodySwitch2', { id: bp.lu32, location: bp.lu32 });
const ClientInventorySwitch = Diablo2Packet.create(0x1f, 'ClientInventorySwitch', {
  itemReplacing: bp.lu32,
  itemReplaced: bp.lu32,
  x: bp.lu32,
  y: bp.lu32,
});
const ClientItemUse = Diablo2Packet.create(0x20, 'ClientItemUse', { itemId: bp.lu32, x: bp.lu32, y: bp.lu32 });
const ClientItemStack = Diablo2Packet.create(0x21, 'ClientItemStack', { stackItem: bp.lu32, targetItem: bp.lu32 });
const ClientItemStackRemove = Diablo2Packet.create(0x22, 'ClientItemStackRemove', { itemId: bp.lu32 });
const ClientItemToBelt = Diablo2Packet.create(0x23, 'ClientItemToBelt', { itemId: bp.lu32, beltLocation: bp.lu32 });
const ClientBeltRemove = Diablo2Packet.create(0x24, 'ClientBeltRemove', { itemId: bp.lu32 });
const ClientBeltSwitch = Diablo2Packet.create(0x25, 'ClientBeltSwitch', {
  itemReplacing: bp.lu32,
  itemReplaced: bp.lu32,
});
const ClientBeltUse = Diablo2Packet.create(0x26, 'ClientBeltUse', {
  itemId: bp.lu32,
  unk1: bp.lu32,
  unk2: bp.lu32,
});
const ClientItemIdentify = Diablo2Packet.create(0x27, 'ClientItemIdentify', { id1: bp.lu32, id2: bp.lu32 });
const ClientItemSocket = Diablo2Packet.create(0x28, 'ClientItemSocket', {
  itemSocketing: bp.lu32,
  itemSocketed: bp.lu32,
});
const ClientItemToTome = Diablo2Packet.create(0x29, 'ClientItemToTome', { scrollId: bp.lu32, tomeId: bp.lu32 });
const ClientItemToCube = Diablo2Packet.create(0x2a, 'ClientItemToCube', { itemId: bp.lu32, cubeId: bp.lu32 });
const ClientUnitSelect = Diablo2Packet.empty(0x2d, 'ClientUnitSelect');
const ClientUnknown0x2e = Diablo2Packet.create(0x2e, 'ClientUnknown0x2e', { unk1: bp.lu16 });
const ClientNpcInit = Diablo2Packet.create(0x2f, 'ClientNpcInit', DataTypeEntity);
const ClientNpcCancel = Diablo2Packet.create(0x30, 'ClientNpcCancel', DataTypeEntity);
const ClientQuestMessage = Diablo2Packet.create(0x31, 'ClientQuestMessage', { unk1: bp.lu32, unk2: bp.lu32 });
const ClientNpcBuy = Diablo2Packet.create(0x32, 'ClientNpcBuy', {
  npcId: bp.lu32,
  itemId: bp.lu32,
  bufferType: bp.lu32,
  cost: bp.lu32,
});
const ClientNpcSell = Diablo2Packet.create(0x33, 'ClientNpcSell', {
  npcId: bp.lu32,
  itemId: bp.lu32,
  bufferType: bp.lu32,
  cost: bp.lu32,
});
const ClientIdentifyCan = Diablo2Packet.create(0x34, 'ClientIdentifyCan', { unk1: bp.lu32 });
const ClientRepair = Diablo2Packet.create(0x35, 'ClientRepair', {
  id1: bp.lu32,
  id2: bp.lu32,
  id3: bp.lu32,
  id4: bp.lu32,
});
const ClientMercHire = Diablo2Packet.create(0x36, 'ClientMercHire', { id1: bp.lu32, id2: bp.lu32 });
const ClientGamble = Diablo2Packet.create(0x37, 'ClientGamble', { id: bp.lu32 });
const ClientTradeNpc = Diablo2Packet.create(0x38, 'ClientTradeNpc', {
  tradeType: bp.lu32,
  npcId: bp.lu32,
  unknown: bp.lu32,
});
const ClientPointHealth = Diablo2Packet.create(0x39, 'ClientPointHealth', { type: bp.lu32 });
const ClientPointStat = Diablo2Packet.create(0x3a, 'ClientPointStat', { type: bp.lu16 });
const ClientPointSKill = Diablo2Packet.create(0x3b, 'ClientPointSKill', { type: bp.lu16 });
const ClientSwitchSkill = Diablo2Packet.create(0x3c, 'ClientSwitchSkill', {
  skill: bp.u8,
  unk1: bp.lu16,
  hand: bp.u8,
  unk2: bp.bytes(4),
});
const ClientDoorClose = Diablo2Packet.create(0x3d, 'ClientDoorClose', { unk1: bp.lu32 });
const ClientItemStatUpdate = Diablo2Packet.create(0x3e, 'ClientItemStatUpdate', { id: bp.lu32 });
const ClientCharacterPhrase = Diablo2Packet.create(0x3f, 'ClientCharacterPhrase', { phraseId: bp.lu16 });
const ClientQuestLog = Diablo2Packet.empty(0x40, 'ClientQuestLog');
const ClientRespawn = Diablo2Packet.empty(0x41, 'ClientRespawn');
const ClientSlotPut = Diablo2Packet.create(0x44, 'ClientSlotPut', {
  id1: bp.lu32,
  id2: bp.lu32,
  id3: bp.lu32,
  id4: bp.lu32,
});
const ClientTp = Diablo2Packet.create(0x45, 'ClientTp', { id1: bp.lu32, id2: bp.lu32, id3: bp.lu32 });
const ClientMercInteract = Diablo2Packet.create(0x46, 'ClientMercInteract', {
  mercId: bp.lu32,
  unitId: bp.lu32,
  type: bp.lu32,
});
const ClientMercMove = Diablo2Packet.create(0x47, 'ClientMercMove', { mercId: bp.lu32, x: bp.lu32, y: bp.lu32 });
const ClientUnknown0x48 = Diablo2Packet.empty(0x48, 'ClientUnknown0x48');
const ClientWaypoint = Diablo2Packet.create(0x49, 'ClientWaypoint', { waypointId: bp.lu32, level: bp.lu32 });
const ClientReassign = Diablo2Packet.create(0x4b, 'ClientReassign', { id1: bp.lu32, id2: bp.lu32 });
const ClientItemDisappear = Diablo2Packet.create(0x4c, 'ClientItemDisappear', { id: bp.lu32 });
const ClientUnknown0x4d = Diablo2Packet.create(0x4d, 'ClientUnknown0x4d', { unk1: bp.lu16 });
const ClientTrade = Diablo2Packet.create(0x4f, 'ClientTrade', { requestId: bp.lu32, goldAmount: bp.lu16 });
const ClientGoldDrop = Diablo2Packet.create(0x50, 'ClientGoldDrop', { playedId: bp.lu32, goldAmount: bp.lu32 });
const ClientAssignment = Diablo2Packet.create(0x51, 'ClientAssignment', { unk1: bp.lu32, unk2: bp.lu32 });
const ClientStaOn = Diablo2Packet.empty(0x53, 'ClientStaOn');
const ClientStaOff = Diablo2Packet.empty(0x54, 'ClientStaOff');
const ClientQuestClose = Diablo2Packet.create(0x58, 'ClientQuestClose', { unk1: bp.lu16 });
const ClientTownFolk = Diablo2Packet.create(0x59, 'ClientTownFolk', {
  unk1: bp.lu32,
  unk2: bp.lu32,
  unk3: bp.lu32,
  unk4: bp.lu32,
});
const ClientRelation = Diablo2Packet.create(0x5d, 'ClientRelation', { id: bp.u8, type: bp.u8, playerId: bp.lu32 });
const ClientParty = Diablo2Packet.create(0x5e, 'ClientParty', { actionId: bp.u8, playerId: bp.lu32 });
const ClientPositionUpdate = Diablo2Packet.create(0x5f, 'ClientPositionUpdate', DataTypePoint);
const ClientSwitchEquip = Diablo2Packet.empty(0x60, 'ClientSwitchEquip');
const ClientMercPotion = Diablo2Packet.create(0x61, 'ClientMercPotion', { unk1: bp.lu16 });
const ClientMercResurrect = Diablo2Packet.create(0x62, 'ClientMercResurrect', { id: bp.lu32 });
const ClientInventoryToBelt = Diablo2Packet.create(0x63, 'ClientInveotryToBelt', { id: bp.lu32 });
const ClientGameLogin = Diablo2Packet.create(0x68, 'ClientGameLogin', {
  cookie: bp.lu32,
  gameId: bp.lu16,
  class: DataPlayerClass,
  version: bp.lu32,
  constant: bp.bytes(8),
  locale: bp.u8,
  name: bp.string(16),
});
const ClientGameExit = Diablo2Packet.empty(0x69, 'ClientGameExit');
const ClientGameEnter = Diablo2Packet.empty(0x6b, 'ClientGameEnter');
const ClientPing = Diablo2Packet.create(0x6d, 'ClientPing', { count: bp.lu32, delay: bp.lu32, warden: bp.lu32 });

export const ClientPacketsPod = {
  ClientTp,
  ClientMercInteract,
  ClientMercMove,
  ClientUnknown0x48,
  ClientWaypoint,
  ClientReassign,
  ClientTrade,
  ClientGoldDrop,
  ClientStaOn,
  ClientStaOff,
  ClientParty,
  ClientChatMessage,
  ClientItemPickup,
  ClientItemDrop,
  ClientItemToCursor,
  ClientItemPickupToCursor,
  ClientItemToBody,
  ClientItemSwap2Hand,
  ClientItemPickupBody,
  ClientBodySwitch,
  ClientBodySwitch2,
  ClientInventorySwitch,
  ClientItemUse,
  ClientItemStack,
  ClientItemStackRemove,
  ClientItemToBelt,
  ClientBeltRemove,
  ClientBeltSwitch,
  ClientBeltUse,
  ClientItemIdentify,
  ClientItemSocket,
  ClientItemToTome,
  ClientItemToCube,
  ClientUnitSelect,
  ClientUnknown0x2e,
  ClientNpcInit,
  ClientNpcCancel,
  ClientQuestMessage,
  ClientNpcBuy,
  ClientNpcSell,
  ClientIdentifyCan,
  ClientRepair,
  ClientMercHire,
  ClientGamble,
  ClientTradeNpc,
  ClientPointHealth,
  ClientPointStat,
  ClientPointSKill,
  ClientSwitchSkill,
  ClientDoorClose,
  ClientItemStatUpdate,
  ClientCharacterPhrase,
  ClientQuestLog,
  ClientRespawn,
  ClientSlotPut,
  ClientUnknown0x4d,
  ClientItemDisappear,
  ClientAssignment,
  ClientQuestClose,
  ClientTownFolk,
  ClientPositionUpdate,
  ClientRelation,
  ClientMercPotion,
  ClientMercResurrect,
  ClientInventoryToBelt,
  ClientGameEnter,
  ClientGameExit,
  ClientGameLogin,
  ClientPing,
  ClientRunToCoOrd,
  ClientRunToUnit,
  ClientSkillLeft,
  ClientSkillLeftOnEntity,
  ClientSkillLeftOnEntityEx,
  ClientSkillLeftOnEntityEx2,
  ClientSkillLeftOnEntityEx3,
  ClientSkillLeftOnLocationEx,
  ClientSkillRight,
  ClientSkillRightEntity,
  ClientSkillRightEntityEx,
  ClientSkillRightEntityEx2,
  ClientSkillRightEntityEx3,
  ClientSkillRightEx,
  ClientSkillUnk1,
  ClientSwitchEquip,
  ClientWalkToCoOrd,
  ClientWalkToUnit,
  ClientInteractEntity,
  ClientSkillUnk2,
  ClientOverHeadMessage,
};
