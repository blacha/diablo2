import { DataArray, DataLookup, DataObject, DataString, UInt16, UInt32, UInt8, VariableDataArray } from '../data.types';
import { Difficulty, UnitType } from '@diablo2/data';
import { DataTypeItem } from '../data.types.item';
import { Diablo2Packet } from '../packet';

// const DataUnitType = DataLookup('UnitType', UnitType, UInt8);
const DataPlayerClass = DataLookup('PlayerClass', UnitType, UInt8);
const DataDifficulty = DataLookup('Difficulty', Difficulty, UInt8);

export const GameLoading = new Diablo2Packet(0x00, 'GameLoading', {});
export const GameLogonReceipt = new Diablo2Packet(0x01, 'GameLogonReceipt', {
  difficulty: DataDifficulty,
  unk1: UInt16,
  hardcore: UInt16,
  expansion: UInt8,
  ladder: UInt8,
  unk2: UInt16,
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
// export const ItemActionOwned = new Diablo2Packet(0x9d, 'ItemActionOwned')

export const Unknown13 = new Diablo2Packet(0x5e, 'Unknown13', { unk1: DataArray(UInt8, 37) });
export const Unknown14 = new Diablo2Packet(0x5f, 'Unknown14', { unk1: DataArray(UInt8, 4) });

export const ServerPacketsPod = [
  GameLoading,
  GameLogonSuccess,
  GameLogonReceipt,
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

  ItemActionWorld,

  Unknown13,
  Unknown14,
];
