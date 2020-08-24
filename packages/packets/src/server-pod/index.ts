import { Act, Difficulty, PlayerClass, UnitType, WarpType } from '@diablo2/data';
import { DataTypeItem } from '../data.types.item';
import { Diablo2Packet } from '../packet';
import { s } from '../strutparse';
import { StrutTypeLookup } from '../strutparse/lookup';
import { StrutTypeArrayOffset } from '../strutparse/object';

const DataAct = new StrutTypeLookup('Act', s.i8, Act);
const DataPlayerClass = new StrutTypeLookup('PlayerClass', s.i8, PlayerClass);
const DataDifficulty = new StrutTypeLookup('Difficulty', s.i8, Difficulty);
// const DataGameObjectMode = new StrutTypeLookup('GameObjectMode', s.i8, GameObjectMode);
// const DataGameObjectInteraction = new StrutTypeLookup('GameObjectInteraction', s.i8, GameObjectInteraction);
const DataWarp = new StrutTypeLookup('Warp', s.i8, WarpType);
const DataUnitType = new StrutTypeLookup('UnitType', s.i8, UnitType);

export const GameLoading = Diablo2Packet.empty(0x00, 'GameLoading');
export const GameLogonReceipt = Diablo2Packet.create(0x01, 'GameLogonReceipt', {
  difficulty: DataDifficulty,
  unk1: s.i16,
  isHardcore: s.i16,
  isExpansion: s.i8,
  isLadder: s.i8,
  unk2: s.i8,
});
export const GameLogonSuccess = Diablo2Packet.empty(0x02, 'GameLogonSuccess');
export const GameActLoad = Diablo2Packet.create(0x03, 'GameActLoad', {
  act: DataAct,
  mapId: s.i32,
  areaId: s.i16,
  unk1: s.i32,
});
export const GameLoadDone = Diablo2Packet.empty(0x04, 'GameLoadDone');
export const GameUnloadDone = Diablo2Packet.empty(0x05, 'GameUnloadDone');
export const GameLogoutSuccess = Diablo2Packet.empty(0x06, 'GameLogoutSuccess');
export const MapAdd = Diablo2Packet.create(0x07, 'MapAdd', { x: s.i16, y: s.i16, areaId: s.i8 });
export const MapRemove = Diablo2Packet.create(0x08, 'MapRemove', { x: s.i16, y: s.i16, areaId: s.i8 });
export const WarpAssign = Diablo2Packet.create(0x09, 'WarpAssign', {
  type: DataUnitType,
  unitId: s.i32,
  warp: DataWarp,
  x: s.i16,
  y: s.i16,
});
export const ObjectRemove = Diablo2Packet.create(0x0a, 'ObjectRemove', { unitType: s.i8, unitId: s.i32 });
export const GameHandshake = Diablo2Packet.create(0x0b, 'GameHandshake', { unitType: s.i8, unitId: s.i32 });
export const NpcGetHit = Diablo2Packet.create(0x0c, 'NpcGetHit', {
  unitType: s.i8,
  unitId: s.i32,
  animationId: s.i16,
  life: s.i8,
});
export const PlayerStop = Diablo2Packet.create(0x0d, 'PlayerStop', {
  unitType: s.i8,
  unitId: s.i32,
  unk1: s.i8,
  x: s.i16,
  y: s.i16,
  unk2: s.i8,
  life: s.i8,
});
export const GameObjectState = Diablo2Packet.create(0x0e, 'GameObjectState', {
  type: s.i8,
  unitId: s.i32,
  unk1: s.i8,
  state: s.i32,
  unk2: s.i8,
});
export const PlayerMove = Diablo2Packet.create(0x0f, 'PlayerMove', {
  unitType: s.i8,
  unitId: s.i32,
  move: s.i8,
  targetX: s.i16,
  targetY: s.i16,
  unk1: s.i8,
  currentX: s.i16,
  currentY: s.i16,
});
export const PlayerMoveToUnit = Diablo2Packet.create(0x10, 'PlayerMoveToUnit', {
  unk1: s.i8,
  playerId: s.i32,
  movementType: s.i8,
  destinationType: s.i8,
  objectId: s.i32,
  x: s.i16,
  y: s.i16,
});
export const ReportKill = Diablo2Packet.create(0x11, 'ReportKill', { unitType: s.i8, unitId: s.i32, unk1: s.i16 });
export const PlayerReassign = Diablo2Packet.create(0x15, 'PlayerReassign', {
  unitType: s.i8,
  unitId: s.i32,
  x: s.i16,
  y: s.i16,
  value: s.i8,
});
export const GoldAddSmall = Diablo2Packet.create(0x19, 'GoldAddSmall', { amount: s.i8 });
export const ExperienceByte = Diablo2Packet.create(0x1a, 'ExperienceByte', { amount: s.i8 });
export const ExperienceWord = Diablo2Packet.create(0x1b, 'ExperienceWord', { amount: s.i16 });
export const ExperienceDWord = Diablo2Packet.create(0x1c, 'ExperienceDWord', { amount: s.i32 });
export const PlayerAttributeByte = Diablo2Packet.create(0x1d, 'PlayerAttributeByte', { attribute: s.i8, amount: s.i8 });
export const PlayerAttributeWord = Diablo2Packet.create(0x1e, 'PlayerAttributeWord', {
  attribute: s.i8,
  amount: s.i16,
});
export const PlayerAttributeDWord = Diablo2Packet.create(0x1f, 'PlayerAttributeDWord', {
  attribute: s.i8,
  amount: s.i32,
});
export const StateNotification = Diablo2Packet.create(0x20, 'StateNotification', {
  unitId: s.i32,
  attribute: s.i8,
  amount: s.i32,
});
export const PlayerSkillUpdate = Diablo2Packet.create(0x21, 'PlayerSkillUpdate', {
  unk1: s.i16,
  unitId: s.i32,
  skill: s.i16,
  baseLevel: s.i8,
  bonusAmount: s.i8,
  unk2: s.i8,
});
export const PlayerItemSkill = Diablo2Packet.create(0x22, 'PlayerItemSkill', {
  unk1: s.i16,
  unitId: s.i32,
  skill: s.i16,
  amount: s.i8,
  unk2: s.i16,
});
export const PlayerAssignSkill = Diablo2Packet.create(0x23, 'PlayerAssignSkill', {
  unitType: s.i8,
  unitId: s.i32,
  hand: s.i8,
  skill: s.i16,
  unk1: s.i32,
});
export const GameChat = Diablo2Packet.create(0x26, 'GameChat', {
  chatKind: s.i16,
  unk1: s.i16,
  unk2: s.i32,
  type: s.i8,
  name: s.string(),
  message: s.string(),
});
export const NpcInfo = Diablo2Packet.create(0x27, 'NpcInfo', { unitType: s.i8, unitId: s.i32, unk1: s.bytes(34) });
export const QuestInfo = Diablo2Packet.create(0x28, 'QuestInfo', { unk1: s.bytes(102) });
export const QuestLog = Diablo2Packet.create(0x29, 'QuestLog', { unk1: s.bytes(96) });
export const TradeComplete = Diablo2Packet.create(0x2a, 'TradeComplete', {
  tradeType: s.i8,
  result: s.i8,
  unk1: s.i32,
  merchandiseId: s.i32,
  goldInInventory: s.i32,
});
export const PlaySound = Diablo2Packet.create(0x2c, 'PlaySound', { unitType: s.i8, unitId: s.i32, sound: s.i16 });
export const ItemContainerUpdate = Diablo2Packet.create(0x3e, 'ItemContainerUpdate', { unk1: s.bytes(33) });
export const ItemStackUse = Diablo2Packet.create(0x3f, 'ItemStackUse', { unk1: s.bytes(7) });
export const PlayerCursorClear = Diablo2Packet.create(0x42, 'PlayerCursorClear', { unitType: s.i8, playerId: s.i32 });
export const Relator1 = Diablo2Packet.create(0x47, 'Relator1', { param1: s.i16, unityId: s.i32, param2: s.i32 });
export const Relator2 = Diablo2Packet.create(0x48, 'Relator2', { param1: s.i16, unityId: s.i32, param2: s.i32 });
export const UnitUseSkillOnTarget = Diablo2Packet.create(0x4c, 'UnitUseSkillOnTarget', {
  unitType: s.i8,
  unitId: s.i32,
  skill: s.i16,
  unk1: s.i8,
  unk2: s.i8,
  targetId: s.i32,
  unk3: s.i16,
});
export const UnitUseSkill = Diablo2Packet.create(0x4d, 'UnitUseSkill', {
  unitType: s.i8,
  unitId: s.i32,
  skill: s.i16,
  unk1: s.i8,
  unk2: s.i16,
  x: s.i16,
  y: s.i16,
  unk3: s.i16,
});
export const MercForHire = Diablo2Packet.create(0x4e, 'MercForHire', { mercId: s.i16, unk1: s.i32 });
export const MercForHireListStart = Diablo2Packet.empty(0x4f, 'MercForHireListStart');
export const GameStart = Diablo2Packet.create(0x50, 'GameStart', { unk1: s.bytes(14) });
export const GameObjectAssign = Diablo2Packet.create(0x51, 'GameObjectAssign', {
  objectType: s.i8,
  objectId: s.i32,
  objectUniqueCode: s.i16,
  x: s.i16,
  y: s.i16,
  state: s.i8,
  interactionCondition: s.i8,
});
export const PlayerQuestLog = Diablo2Packet.create(0x52, 'PlayerQuestLog', { unk1: s.bytes(41) });
export const PartyRefresh = Diablo2Packet.create(0x53, 'PartyRefresh', { slot: s.i32, unk1: s.i8, tickCount: s.i32 });
export const PlayerAssign = Diablo2Packet.create(0x59, 'PlayerAssign', {
  guid: s.i32,
  class: DataPlayerClass,
  name: s.string(16),
  x: s.i16,
  y: s.i16,
});
export const PlayerInformation = Diablo2Packet.create(0x5a, 'PlayerInformation', { unk1: s.bytes(39) });
export const PlayerInGame = Diablo2Packet.create(0x5b, 'PlayerInGame', {
  packetLength: s.i16,
  playerId: s.i32,
  class: DataPlayerClass,
  name: s.string(16),
  level: s.i16,
  partyId: s.i16,
  unk1: s.bytes(8),
});
export const PlayerLeft = Diablo2Packet.create(0x5c, 'PlayerLeft', { playerId: s.i32 });
export const QuestItemState = Diablo2Packet.create(0x5d, 'QuestItemState', { unk1: s.i8, state: s.i16, unk2: s.i16 });
export const TownPortal = Diablo2Packet.create(0x60, 'TownPortal', { state: s.i8, areaId: s.i8, unitId: s.i32 });
export const WayPointMenu = Diablo2Packet.create(0x63, 'WayPointMenu', {
  unitId: s.i32,
  wpA: s.i32,
  wpB: s.i32,
  wpC: s.i32,
  wpD: s.i32,
});
export const PlayerKillCount = Diablo2Packet.create(0x65, 'PlayerKillCount', { playerId: s.i32, count: s.i16 });
export const NpcMove = Diablo2Packet.create(0x67, 'NpcMove', {
  unitId: s.i32,
  type: s.i8,
  x: s.i16,
  y: s.i16,
  unk1: s.i16,
  unk2: s.i8,
  unk3: s.i16,
  unk4: s.i8,
});
export const NpcMoveToTarget = Diablo2Packet.create(0x68, 'NpcMoveToTarget', {
  unitId: s.i32,
  type: s.i8,
  x: s.i16,
  y: s.i16,
  targetUnitType: s.i8,
  targetId: s.i32,
  unk1: s.i16,
  unk2: s.i8,
  unk3: s.i16,
  unk4: s.i8,
});
export const NpcUpdate = Diablo2Packet.create(0x69, 'NpcUpdate', {
  unitId: s.i32,
  state: s.i8,
  x: s.i16,
  y: s.i16,
  unitLife: s.i8,
  unk1: s.i8,
});
export const NpcAction = Diablo2Packet.create(0x6b, 'NpcAction', {
  unitId: s.i32,
  action: s.i8,
  unk1: s.bytes(6),
  x: s.i16,
  y: s.i16,
});
export const NpcAttack = Diablo2Packet.create(0x6c, 'NpcAttack', {
  unitId: s.i32,
  attackType: s.i16,
  targetId: s.i32,
  targetType: s.i8,
  x: s.i16,
  y: s.i16,
});
export const NpcStop = Diablo2Packet.create(0x6d, 'NpcStop', { unitId: s.i32, x: s.i16, y: s.i16, unitLife: s.i8 });
export const PlayerCorpse = Diablo2Packet.create(0x74, 'PlayerCorpse', {
  assign: s.i8,
  ownerId: s.i32,
  corpseId: s.i32,
});
export const PlayerAbout = Diablo2Packet.create(0x75, 'PlayerAbout', {
  unitId: s.i32,
  partyId: s.i16,
  charLvl: s.i16,
  relationship: s.i16,
  inYourParty: s.i16,
});
export const PlayerInProximity = Diablo2Packet.create(0x76, 'PlayerInProximity', { unitType: s.i8, unitId: s.i32 });
export const TradeAction = Diablo2Packet.create(0x77, 'TradeAction', { requestType: s.i8 });
export const TradeAccept = Diablo2Packet.create(0x78, 'TradeAccept', { charName: s.bytes(16), unitId: s.i32 });
export const TradeGold = Diablo2Packet.create(0x79, 'TradeGold', { goldOwner: s.i8, amount: s.i32 });
export const SummonAction = Diablo2Packet.create(0x7a, 'SummonAction', { unk1: s.bytes(12) });
export const SkillAssignHotkey = Diablo2Packet.create(0x7b, 'SkillAssignHotkey', {
  slot: s.i8,
  skill: s.i8,
  hand: s.i8,
  unk1: s.bytes(4),
});
export const UseScroll = Diablo2Packet.create(0x7c, 'UseScroll', { type: s.i8, itemId: s.i32 });
export const ItemStateSet = Diablo2Packet.create(0x7d, 'ItemStateSet', { unk1: s.bytes(17) });
export const PartyMemberUpdate = Diablo2Packet.create(0x7f, 'PartyMemberUpdate', {
  unitType: s.i8,
  unitLife: s.i16,
  unitId: s.i32,
  unitAreaId: s.i16,
});
export const MercAssign = Diablo2Packet.create(0x81, 'MercAssign', {
  unk1: s.i8,
  mercKind: s.i16,
  ownerId: s.i32,
  mercId: s.i32,
  unk2: s.i32,
  unk3: s.i32,
});
export const PortalOwnership = Diablo2Packet.create(0x82, 'PortalOwnership', {
  ownerId: s.i32,
  ownerName: s.bytes(16),
  localId: s.i32,
  remoteId: s.i32,
});
export const UniqueEvent = Diablo2Packet.create(0x89, 'UniqueEvent', { eventId: s.i8 });
export const NpcWantsInteract = Diablo2Packet.create(0x8a, 'NpcWantsInteract', { unitType: s.i8, unitId: s.i32 });
export const RelationshipParty = Diablo2Packet.create(0x8b, 'RelationshipParty', { unitId: s.i32, state: s.i8 });
export const RelationshipUpdate = Diablo2Packet.create(0x8c, 'RelationshipUpdate', {
  player1Id: s.i32,
  player2Id: s.i32,
  relationshipState: s.i16,
});
export const PartyPlayerAssign = Diablo2Packet.create(0x8d, 'PartyPlayerAssign', { playerId: s.i32, partyId: s.i16 });
export const PlayerCorpseAssign = Diablo2Packet.create(0x8e, 'PlayerCorpseAssign', {
  assign: s.i8,
  ownerId: s.i32,
  corpseId: s.i32,
});
export const Pong = Diablo2Packet.create(0x8f, 'Pong', { tickCount: s.bytes(32) });
export const PartyMemberPulse = Diablo2Packet.create(0x90, 'PartyMemberPulse', { playerId: s.i32, x: s.i32, y: s.i32 });
export const BaseSkills = Diablo2Packet.create(0x94, 'BaseSkills', {
  amount: s.offset,
  playerId: s.i32,
  skills: new StrutTypeArrayOffset(s.object('SkillLevels', { skill: s.i16, level: s.i8 }), false),
});
export const PlayerWeaponSwitch = Diablo2Packet.empty(0x97, 'PlayerWeaponSwitch');
export const SkillTriggered = Diablo2Packet.create(0x99, 'SkillTriggered', { unk1: s.bytes(15) });
export const MercRelated = Diablo2Packet.create(0x9b, 'MercRelated', { unk1: s.i16, unk2: s.i32 });
export const MercAttributeByte = Diablo2Packet.create(0x9e, 'MercAttributeByte', {
  attribute: s.i8,
  mercId: s.i32,
  amount: s.i8,
});
export const MercAttributeWord = Diablo2Packet.create(0x9f, 'MercAttributeWord', {
  attribute: s.i8,
  mercId: s.i32,
  amount: s.i16,
});
export const MercAttributeDWord = Diablo2Packet.create(0xa0, 'MercAttributeDWord', {
  attribute: s.i8,
  mercId: s.i32,
  amount: s.i32,
});
export const MercExperienceByte = Diablo2Packet.create(0xa1, 'MercExperienceByte', { unk1: s.bytes(6) });
export const MercExperienceWord = Diablo2Packet.create(0xa2, 'MercExperienceWord', { unk1: s.bytes(7) });
export const StateDelayed = Diablo2Packet.create(0xa7, 'StateDelayed', { unitType: s.i8, unitId: s.i32, state: s.i8 });
export const StateSet = Diablo2Packet.create(0xa8, 'StateSet', {
  unitType: s.i8,
  unitId: s.i32,
  packetLength: s.offset,
  state: s.i8,
  stateEffects: new StrutTypeArrayOffset(s.i8, true),
});
export const StateEnd = Diablo2Packet.create(0xa9, 'StateEnd', {
  unitType: s.i8,
  unitId: s.i32,
  state: s.i8,
  // POD Specific?
  unk1: s.i8,
});
export const NpcHeal = Diablo2Packet.create(0xab, 'NpcHeal', { unitType: s.i8, unitId: s.i32, unitLife: s.i8 });
export const NpcAssign = Diablo2Packet.create(0xac, 'NpcAssign', {
  unitId: s.i32,
  code: s.i16,
  x: s.i16,
  y: s.i16,
  life: s.i8,
  packetLength: s.offset,
  stateEffects: new StrutTypeArrayOffset(s.i8, true),
});
export const GameTerminated = Diablo2Packet.empty(0xb0, 'GameTerminated');
export const GameBanIp = Diablo2Packet.create(0xb3, 'GameBanIp', { param: s.i32 });
export const GameChatOverhead = Diablo2Packet.create(0xb5, 'GameChatOverhead', {
  unk1: s.bytes(3),
  unitType: s.i8,
  unitId: s.i32,
  unk2: s.i16,
  unk3: s.i8,
  message: s.i8,
  unk4: s.i8,
});
export const ItemActionWorld = new Diablo2Packet(0x9c, 'ItemActionWorld', DataTypeItem);
export const ItemActionOwned = new Diablo2Packet(0x9d, 'ItemActionOwned', DataTypeItem);
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
export const Unknown0x12 = Diablo2Packet.create(0x12, 'Unknown0x12', { unk1: s.bytes(25) });
export const Unknown0x13 = Diablo2Packet.create(0x13, 'Unknown0x13', { unk1: s.bytes(13) });
export const Unknown0x14 = Diablo2Packet.create(0x14, 'Unknown0x14', { unk1: s.bytes(17) });
export const Unknown0x16 = Diablo2Packet.empty(0x16, 'Unknown0x16');
export const Unknown0x18 = Diablo2Packet.create(0x18, 'Unknown0x18', { unk1: s.bytes(14) });
export const Unknown0x24 = Diablo2Packet.create(0x24, 'Unknown0x24', { unk1: s.bytes(89) });
export const Unknown0x25 = Diablo2Packet.create(0x25, 'Unknown0x25', { unk1: s.bytes(89) });
export const Unknown0x40 = Diablo2Packet.create(0x40, 'Unknown0x40', { unk1: s.bytes(12) });
export const Unknown0x45 = Diablo2Packet.create(0x45, 'Unknown0x45', { unk1: s.bytes(12) });
export const Unknown0x54 = Diablo2Packet.create(0x54, 'Unknown0x54', { unk1: s.bytes(9) });
export const Unknown0x55 = Diablo2Packet.create(0x55, 'Unknown0x55', { unk1: s.bytes(2) });
export const Unknown0x58 = Diablo2Packet.create(0x58, 'Unknown0x58', { unk1: s.bytes(13) });
export const Unknown0x5e = Diablo2Packet.create(0x5e, 'Unknown0x5e', { unk1: s.bytes(37) });
export const Unknown0x5f = Diablo2Packet.create(0x5f, 'Unknown0x5f', { unk1: s.bytes(4) });
export const Unknown0x61 = Diablo2Packet.create(0x61, 'Unknown0x61', { unk1: s.bytes(1) });
export const Unknown0x62 = Diablo2Packet.create(0x62, 'Unknown0x62', { unk1: s.bytes(6) });
export const Unknown0x66 = Diablo2Packet.create(0x66, 'Unknown0x66', { unk1: s.bytes(6) });
export const Unknown0x6a = Diablo2Packet.create(0x6a, 'Unknown0x6a', { unk1: s.bytes(6) });
export const Unknown0x6e = Diablo2Packet.empty(0x6e, 'Unknown0x6e');
export const Unknown0x6f = Diablo2Packet.empty(0x6f, 'Unknown0x6f');
export const Unknown0x70 = Diablo2Packet.empty(0x70, 'Unknown0x70');
export const Unknown0x71 = Diablo2Packet.empty(0x71, 'Unknown0x71');
export const Unknown0x72 = Diablo2Packet.empty(0x72, 'Unknown0x72');
export const Unknown0x73 = Diablo2Packet.create(0x73, 'Unknown0x73', { unk1: s.bytes(31) });
export const Unknown0x7e = Diablo2Packet.create(0x7e, 'Unknown0x7e', { unk1: s.bytes(4) });
export const Unknown0x91 = Diablo2Packet.create(0x91, 'Unknown0x91', { unk1: s.bytes(25) });
export const Unknown0x92 = Diablo2Packet.create(0x92, 'Unknown0x92', { unk1: s.bytes(5) });
export const Unknown0x93 = Diablo2Packet.create(0x93, 'Unknown0x93', { unk1: s.bytes(7) });
export const Unknown0x98 = Diablo2Packet.create(0x98, 'Unknown0x98', { unk1: s.bytes(6) });
export const Unknown0x9a = Diablo2Packet.create(0x9a, 'Unknown0x9a', { unk1: s.bytes(16) });
export const Unknown0xa3 = Diablo2Packet.create(0xa3, 'Unknown0xa3', { unk1: s.bytes(23) });
export const Unknown0xa4 = Diablo2Packet.create(0xa4, 'Unknown0xa4', { unk1: s.bytes(2) });
export const Unknown0xa5 = Diablo2Packet.create(0xa5, 'Unknown0xa5', { unk1: s.bytes(7) });
export const Unknown0xa6 = Diablo2Packet.empty(0xa6, 'Unknown0xa6');
export const Unknown0xad = Diablo2Packet.create(0xad, 'Unknown0xad', { unk1: s.bytes(8) });
export const Unknown0xb1 = Diablo2Packet.create(0xb1, 'Unknown0xb1', { unk1: s.bytes(52) });
export const Unknown0xb2 = Diablo2Packet.empty(0xb2, 'Unknown0xb2');
export const Unknown0xb4 = Diablo2Packet.empty(0xb4, 'Unknown0xb4');

export const ServerPacketsPod = [
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
];
