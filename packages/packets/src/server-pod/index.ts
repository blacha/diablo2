import {
  CString,
  DataArray,
  DataBitField,
  DataLookup,
  DataObject,
  DataString,
  UInt16,
  UInt32,
  UInt8,
  VariableDataArray,
} from '../data.types';
import { Difficulty, UnitType, GameObjectMode, GameObjectInteraction, Act } from '@diablo2/data';
import { DataTypeItem } from '../data.types.item';
import { Diablo2Packet } from '../packet';

// const DataUnitType = DataLookup('UnitType', UnitType, UInt8);
const DataAct = DataLookup('Act', Act, UInt8);
// const DataAct = DataLookup('Act', Act, UInt8);

const DataPlayerClass = DataLookup('PlayerClass', UnitType, UInt8);
const DataDifficulty = DataLookup('Difficulty', Difficulty, UInt8);
const DataGameObjectMode = DataLookup('GameObjectMode', GameObjectMode, UInt8);
const DataGameObjectInteraction = DataLookup('GameObjectInteraction', GameObjectInteraction, UInt8);

export const GameLoading = new Diablo2Packet(0x00, 'GameLoading', {});
export const GameLogonReceipt = new Diablo2Packet(0x01, 'GameLogonReceipt', {
  difficulty: DataDifficulty,
  unk1: UInt16,
  isHardcore: UInt16,
  isExpansion: UInt8,
  isLadder: UInt8,
  unk2: UInt8,
});

export const PlayerAssign = new Diablo2Packet(0x59, 'PlayerAssign', {
  unitId: UInt32,
  type: DataPlayerClass,
  name: DataString(16),
  x: UInt16,
  y: UInt16,
});

export const SetState = new Diablo2Packet(0xa8, 'SetState', {
  unitType: UInt8,
  unitId: UInt32,
  packetLength: UInt8,
  state: UInt8,
  stateEffects: VariableDataArray(UInt8, 'packetLength'),
});

export const GameLogonSuccess = new Diablo2Packet(0x02, 'GameLogonSuccess', {});
export const Pong = new Diablo2Packet(0x8f, 'Pong', { ticks: DataArray(UInt8, 32) });
export const OverHeadClear = new Diablo2Packet(0x76, 'OverHeadClear', { unitType: UInt8, unitId: UInt32 });

export const BaseSkillLevels = new Diablo2Packet(0x94, 'BaseSkillLevel', {
  amount: UInt8,
  unitId: UInt32,
  skills: VariableDataArray(DataObject('SkillLevels', { skill: UInt16, level: UInt8 }), 'amount', false),
});

export const UpdateItemSkill = new Diablo2Packet(0x22, 'UpdateItemSkill', {
  unk1: UInt16,
  unitId: UInt32,
  skill: UInt16,
  amount: UInt8,
  unk2: UInt16,
});

export const NpcInfo = new Diablo2Packet(0x27, 'NpcInfo', {
  unitType: UInt8,
  unitId: UInt32,
  unk1: DataArray(UInt8, 34),
});

export const SetSkill = new Diablo2Packet(0x23, 'SetSkill', {
  unitType: UInt8,
  unitId: UInt32,
  hand: UInt8,
  skill: UInt16,
  unk1: UInt32,
});

export const QuestInfo = new Diablo2Packet(0x28, 'QuestInfo', { unk1: DataArray(UInt8, 102) });
export const QuestLog = new Diablo2Packet(0x29, 'QuestLog', { unk1: DataArray(UInt8, 96) });
export const GameHandShake = new Diablo2Packet(0x0b, 'GameHandShake', { unitType: UInt8, unitId: UInt32 });

export const SetAttributeByte = new Diablo2Packet(0x1d, 'SetAttributeByte', { attribute: UInt8, amount: UInt8 });
export const SetAttributeWord = new Diablo2Packet(0x1e, 'SetAttributeWord', { attribute: UInt8, amount: UInt16 });
export const SetAttributeDWord = new Diablo2Packet(0x1f, 'SetAttributeDWord', { attribute: UInt8, amount: UInt32 });

export const ItemActionWorld = new Diablo2Packet(0x9c, 'ItemActionWorld', { item: DataTypeItem });
export const ItemActionOwned = new Diablo2Packet(0x9d, 'ItemActionOwned', { item: DataTypeItem });

export const AssignSkillHotKey = new Diablo2Packet(0x7b, 'AssignSkillHotKey', {
  slot: UInt8,
  skill: UInt8,
  hand: UInt8,
  unk1: DataArray(UInt8, 4),
});
export const WorldObject = new Diablo2Packet(0x51, 'WorldObject', {
  objectType: UInt8,
  objectId: UInt32,
  objectUuid: UInt16,
  x: UInt16,
  y: UInt16,
  state: DataGameObjectMode,
  interaction: DataGameObjectInteraction,
});

export const NpcMove = new Diablo2Packet(0x67, 'NpcMove', {
  unitId: UInt32,
  type: UInt8,
  x: UInt16,
  y: UInt16,
  unk1: UInt16,
  unk2: UInt8,
  unk3: UInt16,
  unk4: UInt8,
});
export const NpcMoveToTarget = new Diablo2Packet(0x68, 'NpcMoveToTarget', {
  unitId: UInt32,
  type: UInt8,
  x: UInt16,
  y: UInt16,
  targetUnitType: UInt8,
  targetId: UInt32,
  unk1: UInt16,
  unk2: UInt8,
  unk3: UInt16,
  unk4: UInt8,
});
export const NpcStop = new Diablo2Packet(0x6d, 'NpcStop', { unitId: UInt32, x: UInt16, y: UInt16, life: UInt8 });

export const GameChat = new Diablo2Packet(0x26, 'GameChat', {
  chatType: UInt16,
  unk1: UInt16,
  unk2: UInt32,
  type: UInt8,
  name: CString,
  message: CString,
});
export const EndState = new Diablo2Packet(0xa9, 'EndState', {
  unitType: UInt8,
  unitId: UInt32,
  state: UInt8,
  unk1: UInt8,
}); // POD Specific?
export const PlayerLifeChange = new Diablo2Packet(0x95, 'PlayerLifeChange', {
  data: DataBitField('PlayerLifeChange', {
    life: 15,
    mana: 15,
    stamina: 15,
    x: 16,
    y: 16,
    unk1: 19,
  }),
});

export const ExpGainDWord = new Diablo2Packet(0x1c, 'ExpGainDWord', { exp: UInt32 });
export const ExpGainWord = new Diablo2Packet(0x1b, 'ExpGainWord', { exp: UInt16 });
export const ExpGainByte = new Diablo2Packet(0x1a, 'ExpGainByte', { exp: UInt8 });

export const MerAttrDWord = new Diablo2Packet(0xa0, 'MerAttrDWord', {
  attribute: UInt8,
  mercId: UInt32,
  amount: UInt32,
});
export const MerAttrWord = new Diablo2Packet(0x9f, 'MerAttrWord', { attribute: UInt8, mercId: UInt32, amount: UInt16 });
export const MerAttrByte = new Diablo2Packet(0x9e, 'MerAttrByte', { attribute: UInt8, mercId: UInt32, amount: UInt8 });

export const LoadAct = new Diablo2Packet(0x03, 'LoadAct', {
  act: DataAct,
  mapId: UInt32,
  areaId: UInt16,
  unk1: UInt32,
});
export const PartyRefresh = new Diablo2Packet(0x53, 'PartyRefresh', { slot: UInt32, unk1: UInt8, tickCount: UInt32 });
export const MapHide = new Diablo2Packet(0x08, 'MapHide', { x: UInt16, y: UInt16, areaId: UInt8 });
export const MapReveal = new Diablo2Packet(0x07, 'MapReveal', { x: UInt16, y: UInt16, areaId: UInt8 });
export const PlayerReassign = new Diablo2Packet(0x15, 'PlayerReassign', {
  type: UInt8,
  unitId: UInt32,
  x: UInt16,
  y: UInt16,
  value: UInt8,
});

export const NpcAssign = new Diablo2Packet(0xac, 'NpcAssign', {
  unitId: UInt32,
  code: UInt16,
  x: UInt16,
  y: UInt16,
  life: UInt8,
  packetLength: UInt8,
  stateEffects: VariableDataArray(UInt8, 'packetLength'),
});

export const GameObjectModeChange = new Diablo2Packet(0x0e, 'GameObjectModeChange', {
  type: UInt8,
  unitId: UInt32,
  unk1: UInt8,
  state: UInt32,
  unk2: UInt8,
});

export const Relator = new Diablo2Packet(0x47, 'Relator', { param1: UInt16, unitId: UInt32, param2: UInt32 });
export const Relator2 = new Diablo2Packet(0x48, 'Relator2', { param1: UInt16, unitId: UInt32, param2: UInt32 });

export const LoadDone = new Diablo2Packet(0x04, 'LoadDone', {});
export const PlayerInGame = new Diablo2Packet(0x5b, 'PlayerInGame', {
  packetLength: UInt16,
  playerId: UInt32,
  charType: UInt8,
  name: DataString(16),
  level: UInt16,
  partyId: UInt16,
  unk1: DataArray(UInt8, 8),
});

export const ServerPacketsPod = [
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

  new Diablo2Packet(0x5e, 'Unknown0x5e', { unk1: DataArray(UInt8, 37) }),
  new Diablo2Packet(0x5f, 'Unknown0x5f', { unk1: DataArray(UInt8, 4) }),
  new Diablo2Packet(0x2f, 'Unknown0x2f', {}),
  new Diablo2Packet(0x7e, 'Unknown0x7e', { unk1: UInt32 }),
];
