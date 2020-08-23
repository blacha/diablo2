import { Act, Difficulty, GameObjectInteraction, GameObjectMode, PlayerClass } from '@diablo2/data';
import { DataTypeItem } from '../data.types.item';
import { Diablo2Packet } from '../packet';
import { s } from '../strutparse';
import { StrutTypeLookup } from '../strutparse/lookup';
import { StrutTypeArrayOffset } from '../strutparse/object';

const DataAct = new StrutTypeLookup('Act', s.i8, Act);
const DataPlayerClass = new StrutTypeLookup('PlayerClass', s.i8, PlayerClass);
const DataDifficulty = new StrutTypeLookup('Difficulty', s.i8, Difficulty);
const DataGameObjectMode = new StrutTypeLookup('GameObjectMode', s.i8, GameObjectMode);
const DataGameObjectInteraction = new StrutTypeLookup('GameObjectInteraction', s.i8, GameObjectInteraction);

export const GameLoading = Diablo2Packet.empty(0x00, 'GameLoading');
export const GameLogonReceipt = Diablo2Packet.create(0x01, 'GameLogonReceipt', {
  difficulty: DataDifficulty,
  unk1: s.i16,
  isHardcore: s.i16,
  isExpansion: s.i8,
  isLadder: s.i8,
  unk2: s.i8,
});

export const PlayerAssign = Diablo2Packet.create(0x59, 'PlayerAssign', {
  unitId: s.i32,
  type: DataPlayerClass,
  name: s.string(16),
  x: s.i16,
  y: s.i16,
});

export const SetState = Diablo2Packet.create(0xa8, 'SetState', {
  unitType: s.i8,
  unitId: s.i32,
  packetLength: s.offset,
  state: s.i8,
  stateEffects: new StrutTypeArrayOffset(s.i8, true),
});

export const GameLogonSuccess = Diablo2Packet.empty(0x02, 'GameLogonSuccess');
export const Pong = Diablo2Packet.create(0x8f, 'Pong', { ticks: s.bytes(32) });
export const OverHeadClear = Diablo2Packet.create(0x76, 'OverHeadClear', { unitType: s.i8, unitId: s.i32 });

export const BaseSkillLevels = Diablo2Packet.create(0x94, 'BaseSkillLevel', {
  amount: s.offset,
  unitId: s.i32,
  skills: new StrutTypeArrayOffset(s.object('SkillLevels', { skill: s.i16, level: s.i8 }), false),
});

export const UpdateItemSkill = Diablo2Packet.create(0x22, 'UpdateItemSkill', {
  unk1: s.i16,
  unitId: s.i32,
  skill: s.i16,
  amount: s.i8,
  unk2: s.i16,
});

export const NpcInfo = Diablo2Packet.create(0x27, 'NpcInfo', {
  unitType: s.i8,
  unitId: s.i32,
  unk1: s.bytes(34),
});

export const SetSkill = Diablo2Packet.create(0x23, 'SetSkill', {
  unitType: s.i8,
  unitId: s.i32,
  hand: s.i8,
  skill: s.i16,
  unk1: s.i32,
});

export const QuestInfo = Diablo2Packet.create(0x28, 'QuestInfo', { unk1: s.bytes(102) });
export const QuestLog = Diablo2Packet.create(0x29, 'QuestLog', { unk1: s.bytes(96) });
export const GameHandShake = Diablo2Packet.create(0x0b, 'GameHandShake', { unitType: s.i8, unitId: s.i32 });

export const SetAttributeByte = Diablo2Packet.create(0x1d, 'SetAttributeByte', { attribute: s.i8, amount: s.i8 });
export const SetAttributeWord = Diablo2Packet.create(0x1e, 'SetAttributeWord', { attribute: s.i8, amount: s.i16 });
export const SetAttributeDWord = Diablo2Packet.create(0x1f, 'SetAttributeDWord', { attribute: s.i8, amount: s.i32 });

export const ItemActionWorld = new Diablo2Packet(0x9c, 'ItemActionWorld', DataTypeItem);
export const ItemActionOwned = new Diablo2Packet(0x9d, 'ItemActionOwned', DataTypeItem);

export const AssignSkillHotKey = Diablo2Packet.create(0x7b, 'AssignSkillHotKey', {
  slot: s.i8,
  skill: s.i8,
  hand: s.i8,
  unk1: s.bytes(4),
});
export const WorldObject = Diablo2Packet.create(0x51, 'WorldObject', {
  objectType: s.i8,
  objectId: s.i32,
  objectUuid: s.i16,
  x: s.i16,
  y: s.i16,
  state: DataGameObjectMode,
  interaction: DataGameObjectInteraction,
});

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
export const NpcStop = Diablo2Packet.create(0x6d, 'NpcStop', { unitId: s.i32, x: s.i16, y: s.i16, life: s.i8 });

export const GameChat = Diablo2Packet.create(0x26, 'GameChat', {
  chatType: s.i16,
  unk1: s.i16,
  unk2: s.i32,
  type: s.i8,
  name: s.string(),
  message: s.string(),
});
export const EndState = Diablo2Packet.create(0xa9, 'EndState', {
  unitType: s.i8,
  unitId: s.i32,
  state: s.i8,
  // POD Specific?
  unk1: s.i8,
});
export const PlayerLifeChange = new Diablo2Packet(
  0x95,
  'PlayerLifeChange',
  s.bits('PlayerLifeChange', {
    life: 15,
    mana: 15,
    stamina: 15,
    x: 16,
    y: 16,
    unk1: 19,
  }),
);

export const ExpGainDWord = Diablo2Packet.create(0x1c, 'ExpGainDWord', { exp: s.i32 });
export const ExpGainWord = Diablo2Packet.create(0x1b, 'ExpGainWord', { exp: s.i16 });
export const ExpGainByte = Diablo2Packet.create(0x1a, 'ExpGainByte', { exp: s.i8 });

export const MerAttrDWord = Diablo2Packet.create(0xa0, 'MerAttrDWord', {
  attribute: s.i8,
  mercId: s.i32,
  amount: s.i32,
});
export const MerAttrWord = Diablo2Packet.create(0x9f, 'MerAttrWord', { attribute: s.i8, mercId: s.i32, amount: s.i16 });
export const MerAttrByte = Diablo2Packet.create(0x9e, 'MerAttrByte', { attribute: s.i8, mercId: s.i32, amount: s.i8 });

export const LoadAct = Diablo2Packet.create(0x03, 'LoadAct', {
  act: DataAct,
  mapId: s.i32,
  areaId: s.i16,
  unk1: s.i32,
});
export const PartyRefresh = Diablo2Packet.create(0x53, 'PartyRefresh', { slot: s.i32, unk1: s.i8, tickCount: s.i32 });
export const MapHide = Diablo2Packet.create(0x08, 'MapHide', { x: s.i16, y: s.i16, areaId: s.i8 });
export const MapReveal = Diablo2Packet.create(0x07, 'MapReveal', { x: s.i16, y: s.i16, areaId: s.i8 });
export const PlayerReassign = Diablo2Packet.create(0x15, 'PlayerReassign', {
  type: s.i8,
  unitId: s.i32,
  x: s.i16,
  y: s.i16,
  value: s.i8,
});

export const NpcAssign = Diablo2Packet.create(0xac, 'NpcAssign', {
  unitId: s.i32,
  code: s.i16,
  x: s.i16,
  y: s.i16,
  life: s.i8,
  packetLength: s.offset,
  stateEffects: new StrutTypeArrayOffset(s.i8, true),
});

export const GameObjectModeChange = Diablo2Packet.create(0x0e, 'GameObjectModeChange', {
  type: s.i8,
  unitId: s.i32,
  unk1: s.i8,
  state: s.i32,
  unk2: s.i8,
});

export const Relator = Diablo2Packet.create(0x47, 'Relator', { param1: s.i16, unitId: s.i32, param2: s.i32 });
export const Relator2 = Diablo2Packet.create(0x48, 'Relator2', { param1: s.i16, unitId: s.i32, param2: s.i32 });

export const LoadDone = Diablo2Packet.empty(0x04, 'LoadDone');
export const PlayerInGame = Diablo2Packet.create(0x5b, 'PlayerInGame', {
  packetLength: s.i16,
  playerId: s.i32,
  charType: DataPlayerClass,
  name: s.string(16),
  level: s.i16,
  partyId: s.i16,
  unk1: s.bytes(8),
});

export const ServerPacketsPod: Diablo2Packet<any>[] = [
  GameLoading,
  GameLogonSuccess,
  GameLogonReceipt,
  LoadDone,
  MapHide,
  MapReveal,
  PlayerInGame,
  LoadAct,
  PlayerReassign,
  SetState,
  PlayerAssign,
  OverHeadClear,
  BaseSkillLevels,
  UpdateItemSkill,
  NpcInfo,
  SetSkill,
  QuestInfo,
  QuestLog,
  Pong,
  GameHandShake,
  SetAttributeByte,
  SetAttributeWord,
  SetAttributeDWord,
  AssignSkillHotKey,
  WorldObject,
  NpcMove,
  NpcStop,
  NpcMoveToTarget,
  GameChat,
  EndState,
  PlayerLifeChange,
  ExpGainDWord,
  ExpGainWord,
  ExpGainByte,
  PartyRefresh,
  NpcAssign,
  MerAttrDWord,
  MerAttrWord,
  MerAttrByte,
  GameObjectModeChange,
  Relator,
  Relator2,

  ItemActionWorld,
  ItemActionOwned,

  Diablo2Packet.create(0x5e, 'Unknown0x5e', { unk1: s.bytes(37) }),
  Diablo2Packet.create(0x5f, 'Unknown0x5e', { unk1: s.bytes(4) }),
  Diablo2Packet.empty(0x2f, 'Unknown0x5e'),
  Diablo2Packet.create(0x7e, 'Unknown0x5e', { unk1: s.bytes(4) }),
];
