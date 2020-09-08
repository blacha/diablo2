import { DataTypeItem } from '../parser.item';
import { Diablo2Packet } from '../packet';
import { bp } from 'binparse';
import { DataTypeNpc } from '../parser.npc';
import { DataDifficulty, DataAct, DataUnitType, DataWarp, DataAttribute, DataPlayerClass } from './data';

export const GameLoading = Diablo2Packet.empty(0x00, 'GameLoading');
export const GameLogonReceipt = Diablo2Packet.create(0x01, 'GameLogonReceipt', {
  difficulty: DataDifficulty,
  unk1: bp.lu16,
  isHardcore: bp.lu16,
  isExpansion: bp.u8,
  isLadder: bp.u8,
  unk2: bp.u8,
});
export const GameLogonSuccess = Diablo2Packet.empty(0x02, 'GameLogonSuccess');
export const GameActLoad = Diablo2Packet.create(0x03, 'GameActLoad', {
  act: DataAct,
  mapId: bp.lu32,
  areaId: bp.lu16,
  unk1: bp.lu32,
});
export const GameLoadDone = Diablo2Packet.empty(0x04, 'GameLoadDone');
export const GameUnloadDone = Diablo2Packet.empty(0x05, 'GameUnloadDone');
export const GameLogoutSuccess = Diablo2Packet.empty(0x06, 'GameLogoutSuccess');
export const MapAdd = Diablo2Packet.create(0x07, 'MapAdd', { x: bp.lu16, y: bp.lu16, areaId: bp.u8 });
export const MapRemove = Diablo2Packet.create(0x08, 'MapRemove', { x: bp.lu16, y: bp.lu16, areaId: bp.u8 });
export const WarpAssign = Diablo2Packet.create(0x09, 'WarpAssign', {
  type: DataUnitType,
  unitId: bp.lu32,
  warp: DataWarp,
  x: bp.lu16,
  y: bp.lu16,
});
export const ObjectRemove = Diablo2Packet.create(0x0a, 'ObjectRemove', { objectType: bp.u8, objectId: bp.lu32 });
export const GameHandshake = Diablo2Packet.create(0x0b, 'GameHandshake', { unitType: bp.u8, unitId: bp.lu32 });
export const NpcGetHit = Diablo2Packet.create(0x0c, 'NpcGetHit', {
  unitType: bp.u8,
  unitId: bp.lu32,
  animationId: bp.lu16,
  life: bp.u8,
});
export const PlayerStop = Diablo2Packet.create(0x0d, 'PlayerStop', {
  unitType: bp.u8,
  unitId: bp.lu32,
  unk1: bp.u8,
  x: bp.lu16,
  y: bp.lu16,
  unk2: bp.u8,
  life: bp.u8,
});
export const GameObjectState = Diablo2Packet.create(0x0e, 'GameObjectState', {
  type: bp.u8,
  unitId: bp.lu32,
  unk1: bp.u8,
  state: bp.lu32,
  unk2: bp.u8,
});
export const PlayerMove = Diablo2Packet.create(0x0f, 'PlayerMove', {
  unitType: bp.u8,
  unitId: bp.lu32,
  move: bp.u8,
  targetX: bp.lu16,
  targetY: bp.lu16,
  unk1: bp.u8,
  currentX: bp.lu16,
  currentY: bp.lu16,
});
export const PlayerMoveToUnit = Diablo2Packet.create(0x10, 'PlayerMoveToUnit', {
  unk1: bp.u8,
  unitId: bp.lu32,
  movementType: bp.u8,
  destinationType: bp.u8,
  objectId: bp.lu32,
  x: bp.lu16,
  y: bp.lu16,
});
export const ReportKill = Diablo2Packet.create(0x11, 'ReportKill', { unitType: bp.u8, unitId: bp.lu32, unk1: bp.lu16 });
export const PlayerReassign = Diablo2Packet.create(0x15, 'PlayerReassign', {
  unitType: bp.u8,
  unitId: bp.lu32,
  x: bp.lu16,
  y: bp.lu16,
  value: bp.u8,
});
export const GoldAddSmall = Diablo2Packet.create(0x19, 'GoldAddSmall', { amount: bp.u8 });
export const ExperienceByte = Diablo2Packet.create(0x1a, 'ExperienceByte', { amount: bp.u8 });
export const ExperienceWord = Diablo2Packet.create(0x1b, 'ExperienceWord', { amount: bp.lu16 });
export const ExperienceDWord = Diablo2Packet.create(0x1c, 'ExperienceDWord', { amount: bp.lu32 });
export const PlayerAttributeByte = Diablo2Packet.create(0x1d, 'PlayerAttributeByte', {
  attribute: DataAttribute,
  amount: bp.u8,
});
export const PlayerAttributeWord = Diablo2Packet.create(0x1e, 'PlayerAttributeWord', {
  attribute: DataAttribute,
  amount: bp.lu16,
});
export const PlayerAttributeDWord = Diablo2Packet.create(0x1f, 'PlayerAttributeDWord', {
  attribute: DataAttribute,
  amount: bp.lu32,
});
export const StateNotification = Diablo2Packet.create(0x20, 'StateNotification', {
  unitId: bp.lu32,
  attribute: bp.u8,
  amount: bp.lu32,
});
export const PlayerSkillUpdate = Diablo2Packet.create(0x21, 'PlayerSkillUpdate', {
  unk1: bp.lu16,
  unitId: bp.lu32,
  skill: bp.lu16,
  baseLevel: bp.u8,
  bonusAmount: bp.u8,
  unk2: bp.u8,
});
export const PlayerItemSkill = Diablo2Packet.create(0x22, 'PlayerItemSkill', {
  unk1: bp.lu16,
  unitId: bp.lu32,
  skill: bp.lu16,
  amount: bp.u8,
  unk2: bp.lu16,
});
export const PlayerAssignSkill = Diablo2Packet.create(0x23, 'PlayerAssignSkill', {
  unitType: bp.u8,
  unitId: bp.lu32,
  hand: bp.u8,
  skill: bp.lu16,
  unk1: bp.lu32,
});
export const GameChat = Diablo2Packet.create(0x26, 'GameChat', {
  chatKind: bp.lu16,
  unk1: bp.lu16,
  unk2: bp.lu32,
  type: bp.u8,
  name: bp.string(),
  message: bp.string(),
});
export const NpcInfo = Diablo2Packet.create(0x27, 'NpcInfo', { unitType: bp.u8, unitId: bp.lu32, unk1: bp.bytes(34) });
export const QuestInfo = Diablo2Packet.create(0x28, 'QuestInfo', { unk1: bp.bytes(102) });
export const QuestLog = Diablo2Packet.create(0x29, 'QuestLog', { unk1: bp.bytes(96) });
export const TradeComplete = Diablo2Packet.create(0x2a, 'TradeComplete', {
  tradeType: bp.u8,
  result: bp.u8,
  unk1: bp.lu32,
  merchandiseId: bp.lu32,
  goldInInventory: bp.lu32,
});
export const PlaySound = Diablo2Packet.create(0x2c, 'PlaySound', { unitType: bp.u8, unitId: bp.lu32, sound: bp.lu16 });
export const ItemContainerUpdate = Diablo2Packet.create(0x3e, 'ItemContainerUpdate', { unk1: bp.bytes(33) });
export const ItemStackUse = Diablo2Packet.create(0x3f, 'ItemStackUse', { unk1: bp.bytes(7) });
export const PlayerCursorClear = Diablo2Packet.create(0x42, 'PlayerCursorClear', {
  unitType: bp.u8,
  unitId: bp.lu32,
});
export const Relator1 = Diablo2Packet.create(0x47, 'Relator1', { param1: bp.lu16, unityId: bp.lu32, param2: bp.lu32 });
export const Relator2 = Diablo2Packet.create(0x48, 'Relator2', { param1: bp.lu16, unityId: bp.lu32, param2: bp.lu32 });
export const UnitUseSkillOnTarget = Diablo2Packet.create(0x4c, 'UnitUseSkillOnTarget', {
  unitType: bp.u8,
  unitId: bp.lu32,
  skill: bp.lu16,
  unk1: bp.u8,
  unk2: bp.u8,
  targetId: bp.lu32,
  unk3: bp.lu16,
});
export const UnitUseSkill = Diablo2Packet.create(0x4d, 'UnitUseSkill', {
  unitType: bp.u8,
  unitId: bp.lu32,
  skill: bp.lu16,
  unk1: bp.u8,
  unk2: bp.lu16,
  x: bp.lu16,
  y: bp.lu16,
  unk3: bp.lu16,
});
export const MercForHire = Diablo2Packet.create(0x4e, 'MercForHire', { mercId: bp.lu16, unk1: bp.lu32 });
export const MercForHireListStart = Diablo2Packet.empty(0x4f, 'MercForHireListStart');
export const GameStart = Diablo2Packet.create(0x50, 'GameStart', { unk1: bp.bytes(14) });
export const GameObjectAssign = Diablo2Packet.create(0x51, 'GameObjectAssign', {
  objectType: bp.u8,
  objectId: bp.lu32,
  objectUniqueCode: bp.lu16,
  x: bp.lu16,
  y: bp.lu16,
  state: bp.u8,
  interactionCondition: bp.u8,
});
export const PlayerQuestLog = Diablo2Packet.create(0x52, 'PlayerQuestLog', { unk1: bp.bytes(41) });
export const PartyRefresh = Diablo2Packet.create(0x53, 'PartyRefresh', {
  slot: bp.lu32,
  unk1: bp.u8,
  tickCount: bp.lu32,
});
export const PlayerAssign = Diablo2Packet.create(0x59, 'PlayerAssign', {
  unitId: bp.lu32,
  class: DataPlayerClass,
  name: bp.string(16),
  x: bp.lu16,
  y: bp.lu16,
});
export const PlayerInformation = Diablo2Packet.create(0x5a, 'PlayerInformation', { unk1: bp.bytes(39) });
export const PlayerInGame = Diablo2Packet.create(0x5b, 'PlayerInGame', {
  packetLength: bp.lu16,
  unitId: bp.lu32,
  class: DataPlayerClass,
  name: bp.string(16),
  level: bp.lu16,
  partyId: bp.lu16,
  unk1: bp.bytes(8),
});
export const PlayerLeft = Diablo2Packet.create(0x5c, 'PlayerLeft', { unitId: bp.lu32 });
export const QuestItemState = Diablo2Packet.create(0x5d, 'QuestItemState', {
  unk1: bp.u8,
  state: bp.lu16,
  unk2: bp.lu16,
});
export const TownPortal = Diablo2Packet.create(0x60, 'TownPortal', { state: bp.u8, areaId: bp.u8, unitId: bp.lu32 });
export const WayPointMenu = Diablo2Packet.create(0x63, 'WayPointMenu', {
  unitId: bp.lu32,
  wpA: bp.lu32,
  wpB: bp.lu32,
  wpC: bp.lu32,
  wpD: bp.lu32,
});
export const PlayerKillCount = Diablo2Packet.create(0x65, 'PlayerKillCount', { unitId: bp.lu32, count: bp.lu16 });
export const NpcMove = Diablo2Packet.create(0x67, 'NpcMove', {
  unitId: bp.lu32,
  type: bp.u8,
  x: bp.lu16,
  y: bp.lu16,
  unk1: bp.lu16,
  unk2: bp.u8,
  unk3: bp.lu16,
  unk4: bp.u8,
});
export const NpcMoveToTarget = Diablo2Packet.create(0x68, 'NpcMoveToTarget', {
  unitId: bp.lu32,
  type: bp.u8,
  x: bp.lu16,
  y: bp.lu16,
  targetUnitType: bp.u8,
  targetId: bp.lu32,
  unk1: bp.lu16,
  unk2: bp.u8,
  unk3: bp.lu16,
  unk4: bp.u8,
});
export const NpcUpdate = Diablo2Packet.create(0x69, 'NpcUpdate', {
  unitId: bp.lu32,
  state: bp.u8,
  x: bp.lu16,
  y: bp.lu16,
  unitLife: bp.u8,
  unk1: bp.u8,
});
export const NpcAction = Diablo2Packet.create(0x6b, 'NpcAction', {
  unitId: bp.lu32,
  action: bp.u8,
  unk1: bp.bytes(6),
  x: bp.lu16,
  y: bp.lu16,
});
export const NpcAttack = Diablo2Packet.create(0x6c, 'NpcAttack', {
  unitId: bp.lu32,
  attackType: bp.lu16,
  targetId: bp.lu32,
  targetType: bp.u8,
  x: bp.lu16,
  y: bp.lu16,
});
export const NpcStop = Diablo2Packet.create(0x6d, 'NpcStop', {
  unitId: bp.lu32,
  x: bp.lu16,
  y: bp.lu16,
  unitLife: bp.u8,
});
export const PlayerCorpse = Diablo2Packet.create(0x74, 'PlayerCorpse', {
  assign: bp.u8,
  ownerId: bp.lu32,
  corpseId: bp.lu32,
});
export const PlayerAbout = Diablo2Packet.create(0x75, 'PlayerAbout', {
  unitId: bp.lu32,
  partyId: bp.lu16,
  charLvl: bp.lu16,
  relationship: bp.lu16,
  inYourParty: bp.lu16,
});
export const PlayerInProximity = Diablo2Packet.create(0x76, 'PlayerInProximity', { unitType: bp.u8, unitId: bp.lu32 });
export const TradeAction = Diablo2Packet.create(0x77, 'TradeAction', { requestType: bp.u8 });
export const TradeAccept = Diablo2Packet.create(0x78, 'TradeAccept', { charName: bp.bytes(16), unitId: bp.lu32 });
export const TradeGold = Diablo2Packet.create(0x79, 'TradeGold', { goldOwner: bp.u8, amount: bp.lu32 });
export const SummonAction = Diablo2Packet.create(0x7a, 'SummonAction', { unk1: bp.bytes(12) });
export const SkillAssignHotkey = Diablo2Packet.create(0x7b, 'SkillAssignHotkey', {
  slot: bp.u8,
  skill: bp.u8,
  hand: bp.u8,
  unk1: bp.bytes(4),
});
export const UseScroll = Diablo2Packet.create(0x7c, 'UseScroll', { type: bp.u8, itemId: bp.lu32 });
export const ItemStateSet = Diablo2Packet.create(0x7d, 'ItemStateSet', { unk1: bp.bytes(17) });
export const PartyMemberUpdate = Diablo2Packet.create(0x7f, 'PartyMemberUpdate', {
  unitType: bp.u8,
  unitLife: bp.lu16,
  unitId: bp.lu32,
  unitAreaId: bp.lu16,
});
export const MercAssign = Diablo2Packet.create(0x81, 'MercAssign', {
  unk1: bp.u8,
  mercKind: bp.lu16,
  ownerId: bp.lu32,
  mercId: bp.lu32,
  unk2: bp.lu32,
  unk3: bp.lu32,
});
export const PortalOwnership = Diablo2Packet.create(0x82, 'PortalOwnership', {
  ownerId: bp.lu32,
  ownerName: bp.bytes(16),
  localId: bp.lu32,
  remoteId: bp.lu32,
});
export const UniqueEvent = Diablo2Packet.create(0x89, 'UniqueEvent', { eventId: bp.u8 });
export const NpcWantsInteract = Diablo2Packet.create(0x8a, 'NpcWantsInteract', { unitType: bp.u8, unitId: bp.lu32 });
export const RelationshipParty = Diablo2Packet.create(0x8b, 'RelationshipParty', { unitId: bp.lu32, state: bp.u8 });
export const RelationshipUpdate = Diablo2Packet.create(0x8c, 'RelationshipUpdate', {
  player1Id: bp.lu32,
  player2Id: bp.lu32,
  relationshipState: bp.lu16,
});
export const PartyPlayerAssign = Diablo2Packet.create(0x8d, 'PartyPlayerAssign', {
  unitId: bp.lu32,
  partyId: bp.lu16,
});
export const PlayerCorpseAssign = Diablo2Packet.create(0x8e, 'PlayerCorpseAssign', {
  assign: bp.u8,
  ownerId: bp.lu32,
  corpseId: bp.lu32,
});
export const Pong = Diablo2Packet.create(0x8f, 'Pong', { tickCount: bp.bytes(32) });
export const PartyMemberPulse = Diablo2Packet.create(0x90, 'PartyMemberPulse', {
  unitId: bp.lu32,
  x: bp.lu32,
  y: bp.lu32,
});
export const BaseSkills = Diablo2Packet.create(0x94, 'BaseSkills', {
  amount: bp.variable('count', bp.u8),
  unitId: bp.lu32,
  skills: bp.array('Skills', bp.object('SkillLevels', { skill: bp.lu16, level: bp.u8 }), 'count', false),
});
export const PlayerWeaponSwitch = Diablo2Packet.empty(0x97, 'PlayerWeaponSwitch');
export const SkillTriggered = Diablo2Packet.create(0x99, 'SkillTriggered', { unk1: bp.bytes(15) });
export const MercRelated = Diablo2Packet.create(0x9b, 'MercRelated', { unk1: bp.lu16, unk2: bp.lu32 });
export const MercAttributeByte = Diablo2Packet.create(0x9e, 'MercAttributeByte', {
  attribute: bp.u8,
  mercId: bp.lu32,
  amount: bp.u8,
});
export const MercAttributeWord = Diablo2Packet.create(0x9f, 'MercAttributeWord', {
  attribute: bp.u8,
  mercId: bp.lu32,
  amount: bp.lu16,
});
export const MercAttributeDWord = Diablo2Packet.create(0xa0, 'MercAttributeDWord', {
  attribute: bp.u8,
  mercId: bp.lu32,
  amount: bp.lu32,
});
export const MercExperienceByte = Diablo2Packet.create(0xa1, 'MercExperienceByte', { unk1: bp.bytes(6) });
export const MercExperienceWord = Diablo2Packet.create(0xa2, 'MercExperienceWord', { unk1: bp.bytes(7) });
export const StateDelayed = Diablo2Packet.create(0xa7, 'StateDelayed', {
  unitType: bp.u8,
  unitId: bp.lu32,
  state: bp.u8,
});
export const StateSet = Diablo2Packet.create(0xa8, 'StateSet', {
  unitType: bp.u8,
  unitId: bp.lu32,
  packetLength: bp.variable('count', bp.u8),
  state: bp.u8,
  stateEffects: bp.array('StateEffects', bp.u8, 'count', true),
});
export const StateEnd = Diablo2Packet.create(0xa9, 'StateEnd', {
  unitType: bp.u8,
  unitId: bp.lu32,
  state: bp.u8,
  // POD Specific?
  unk1: bp.u8,
});
export const NpcHeal = Diablo2Packet.create(0xab, 'NpcHeal', { unitType: bp.u8, unitId: bp.lu32, unitLife: bp.u8 });
export const NpcAssign = new Diablo2Packet(0xac, 'NpcAssign', new DataTypeNpc());
export const GameTerminated = Diablo2Packet.empty(0xb0, 'GameTerminated');
export const GameBanIp = Diablo2Packet.create(0xb3, 'GameBanIp', { param: bp.lu32 });
export const GameChatOverhead = Diablo2Packet.create(0xb5, 'GameChatOverhead', {
  unk1: bp.bytes(3),
  unitType: bp.u8,
  unitId: bp.lu32,
  unk2: bp.lu16,
  unk3: bp.u8,
  message: bp.u8,
  unk4: bp.u8,
});
export const ItemActionWorld = new Diablo2Packet(0x9c, 'ItemActionWorld', new DataTypeItem());
export const ItemActionOwned = new Diablo2Packet(0x9d, 'ItemActionOwned', new DataTypeItem());
export const PlayerLifeChange = Diablo2Packet.bits(0x95, 'PlayerLifeChange', {
  life: 15,
  mana: 15,
  stamina: 15,
  x: 16,
  y: 16,
  unk1: 19,
});
export const WalkVerify = Diablo2Packet.bits(0x96, 'WalkVerify', {
  /** Player stamina */
  stamina: 15,
  /** Player X Offset */
  x: 15,
  unk1: 1,
  y: 15,
  unk2: 18,
});
export const Unknown0x12 = Diablo2Packet.create(0x12, 'Unknown0x12', { unk1: bp.bytes(25) });
export const Unknown0x13 = Diablo2Packet.create(0x13, 'Unknown0x13', { unk1: bp.bytes(13) });
export const Unknown0x14 = Diablo2Packet.create(0x14, 'Unknown0x14', { unk1: bp.bytes(17) });
export const Unknown0x16 = Diablo2Packet.empty(0x16, 'Unknown0x16');
export const Unknown0x18 = Diablo2Packet.create(0x18, 'Unknown0x18', { unk1: bp.bytes(14) });
export const Unknown0x24 = Diablo2Packet.create(0x24, 'Unknown0x24', { unk1: bp.bytes(89) });
export const Unknown0x25 = Diablo2Packet.create(0x25, 'Unknown0x25', { unk1: bp.bytes(89) });
export const Unknown0x40 = Diablo2Packet.create(0x40, 'Unknown0x40', { unk1: bp.bytes(12) });
export const Unknown0x45 = Diablo2Packet.create(0x45, 'Unknown0x45', { unk1: bp.bytes(12) });
export const Unknown0x54 = Diablo2Packet.create(0x54, 'Unknown0x54', { unk1: bp.bytes(9) });
export const Unknown0x55 = Diablo2Packet.create(0x55, 'Unknown0x55', { unk1: bp.bytes(2) });
export const Unknown0x58 = Diablo2Packet.create(0x58, 'Unknown0x58', { unk1: bp.bytes(13) });
export const Unknown0x5e = Diablo2Packet.create(0x5e, 'Unknown0x5e', { unk1: bp.bytes(37) });
export const Unknown0x5f = Diablo2Packet.create(0x5f, 'Unknown0x5f', { unk1: bp.bytes(4) });
export const Unknown0x61 = Diablo2Packet.create(0x61, 'Unknown0x61', { unk1: bp.bytes(1) });
export const Unknown0x62 = Diablo2Packet.create(0x62, 'Unknown0x62', { unk1: bp.bytes(6) });
export const Unknown0x66 = Diablo2Packet.create(0x66, 'Unknown0x66', { unk1: bp.bytes(6) });
export const Unknown0x6a = Diablo2Packet.create(0x6a, 'Unknown0x6a', { unk1: bp.bytes(6) });
export const Unknown0x6e = Diablo2Packet.empty(0x6e, 'Unknown0x6e');
export const Unknown0x6f = Diablo2Packet.empty(0x6f, 'Unknown0x6f');
export const Unknown0x70 = Diablo2Packet.empty(0x70, 'Unknown0x70');
export const Unknown0x71 = Diablo2Packet.empty(0x71, 'Unknown0x71');
export const Unknown0x72 = Diablo2Packet.empty(0x72, 'Unknown0x72');
export const Unknown0x73 = Diablo2Packet.create(0x73, 'Unknown0x73', { unk1: bp.bytes(31) });
export const Unknown0x7e = Diablo2Packet.create(0x7e, 'Unknown0x7e', { unk1: bp.bytes(4) });
export const Unknown0x91 = Diablo2Packet.create(0x91, 'Unknown0x91', { unk1: bp.bytes(25) });
export const Unknown0x92 = Diablo2Packet.create(0x92, 'Unknown0x92', { unk1: bp.bytes(5) });
export const Unknown0x93 = Diablo2Packet.create(0x93, 'Unknown0x93', { unk1: bp.bytes(7) });
export const Unknown0x98 = Diablo2Packet.create(0x98, 'Unknown0x98', { unk1: bp.bytes(6) });
export const Unknown0x9a = Diablo2Packet.create(0x9a, 'Unknown0x9a', { unk1: bp.bytes(16) });
export const Unknown0xa3 = Diablo2Packet.create(0xa3, 'Unknown0xa3', { unk1: bp.bytes(23) });
export const Unknown0xa4 = Diablo2Packet.create(0xa4, 'Unknown0xa4', { unk1: bp.bytes(2) });
export const Unknown0xa5 = Diablo2Packet.create(0xa5, 'Unknown0xa5', { unk1: bp.bytes(7) });
export const Unknown0xa6 = Diablo2Packet.empty(0xa6, 'Unknown0xa6');
export const Unknown0xad = Diablo2Packet.create(0xad, 'Unknown0xad', { unk1: bp.bytes(8) });
export const Unknown0xb1 = Diablo2Packet.create(0xb1, 'Unknown0xb1', { unk1: bp.bytes(52) });
export const Unknown0xb2 = Diablo2Packet.empty(0xb2, 'Unknown0xb2');
export const Unknown0xb4 = Diablo2Packet.empty(0xb4, 'Unknown0xb4');
export const Unknown0xff = Diablo2Packet.empty(0xff, 'Unknown0xff');

export const ServerPacketsPod = {
  GameLoading,
  GameLogonReceipt,
  GameLogonSuccess,
  GameActLoad,
  GameLoadDone,
  GameUnloadDone,
  GameLogoutSuccess,
  MapAdd,
  MapRemove,
  WarpAssign,
  ObjectRemove,
  GameHandshake,
  NpcGetHit,
  PlayerStop,
  GameObjectState,
  PlayerMove,
  PlayerMoveToUnit,
  ReportKill,
  PlayerReassign,
  GoldAddSmall,
  ExperienceByte,
  ExperienceWord,
  ExperienceDWord,
  PlayerAttributeByte,
  PlayerAttributeWord,
  PlayerAttributeDWord,
  StateNotification,
  PlayerSkillUpdate,
  PlayerItemSkill,
  PlayerAssignSkill,
  GameChat,
  NpcInfo,
  QuestInfo,
  QuestLog,
  TradeComplete,
  PlaySound,
  ItemContainerUpdate,
  ItemStackUse,
  PlayerCursorClear,
  Relator1,
  Relator2,
  UnitUseSkillOnTarget,
  UnitUseSkill,
  MercForHire,
  MercForHireListStart,
  GameStart,
  GameObjectAssign,
  PlayerQuestLog,
  PartyRefresh,
  PlayerAssign,
  PlayerInformation,
  PlayerInGame,
  PlayerLeft,
  QuestItemState,
  TownPortal,
  WayPointMenu,
  PlayerKillCount,
  NpcMove,
  NpcMoveToTarget,
  NpcUpdate,
  NpcAction,
  NpcAttack,
  NpcStop,
  PlayerCorpse,
  PlayerAbout,
  PlayerInProximity,
  TradeAction,
  TradeAccept,
  TradeGold,
  SummonAction,
  SkillAssignHotkey,
  UseScroll,
  ItemStateSet,
  PartyMemberUpdate,
  MercAssign,
  PortalOwnership,
  UniqueEvent,
  NpcWantsInteract,
  RelationshipParty,
  RelationshipUpdate,
  PartyPlayerAssign,
  PlayerCorpseAssign,
  Pong,
  PartyMemberPulse,
  BaseSkills,
  PlayerWeaponSwitch,
  SkillTriggered,
  MercRelated,
  MercAttributeByte,
  MercAttributeWord,
  MercAttributeDWord,
  MercExperienceByte,
  MercExperienceWord,
  StateDelayed,
  StateSet,
  StateEnd,
  NpcHeal,
  NpcAssign,
  GameTerminated,
  GameBanIp,
  GameChatOverhead,
  ItemActionWorld,
  ItemActionOwned,
  PlayerLifeChange,
  WalkVerify,
  Unknown0x12,
  Unknown0x13,
  Unknown0x14,
  Unknown0x16,
  Unknown0x18,
  Unknown0x24,
  Unknown0x25,
  Unknown0x40,
  Unknown0x45,
  Unknown0x54,
  Unknown0x55,
  Unknown0x58,
  Unknown0x5e,
  Unknown0x5f,
  Unknown0x61,
  Unknown0x62,
  Unknown0x66,
  Unknown0x6a,
  Unknown0x6e,
  Unknown0x6f,
  Unknown0x70,
  Unknown0x71,
  Unknown0x72,
  Unknown0x73,
  Unknown0x7e,
  Unknown0x91,
  Unknown0x92,
  Unknown0x93,
  Unknown0x98,
  Unknown0x9a,
  Unknown0xa3,
  Unknown0xa4,
  Unknown0xa5,
  Unknown0xa6,
  Unknown0xad,
  Unknown0xb1,
  Unknown0xb2,
  Unknown0xb4,
  Unknown0xff,
};
