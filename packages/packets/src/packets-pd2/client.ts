import { bp } from 'binparse';
import { Diablo2Packet } from '../packet';
import { ClientPacketsPod } from '../packets-pod/client';

const ClientSkillLeftOnEntity = Diablo2Packet.create(0x06, 'ClientSkillLeftOnEntity', {
  type: bp.lu32,
  entityId: bp.lu32,
});

export const Unknown0x56 = Diablo2Packet.create(0x56, 'Unknown0x56', { bytes: bp.bytes(64) });

export const ClientPacketsPd2 = {
  ...ClientPacketsPod,
  ClientSkillLeftOnEntity,
  Unknown0x56,
};
