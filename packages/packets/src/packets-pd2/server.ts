import { bp } from 'binparse';
import { Diablo2Packet } from '../packet';
import { ServerPacketsPod } from '../packets-pod/server';

export const StateEnd = Diablo2Packet.create(0xa9, 'StateEnd', {
  unitType: bp.u8,
  unitId: bp.lu32,
  state: bp.u8,
});

export const Unknown0x57 = Diablo2Packet.empty(0x57, 'Unknown0x57');

export const Unknown0x56 = Diablo2Packet.create(0x56, 'Unknown0x56', {
  unk1: bp.skip(16),
  packetLength: bp.variable('count', bp.u8),
  unk2: bp.array('Unknown1', bp.u8, 'count'),
});

export const ServerPacketsPd2 = {
  ...ServerPacketsPod,
  StateEnd,
  Unknown0x57,
  Unknown0x56,
};
