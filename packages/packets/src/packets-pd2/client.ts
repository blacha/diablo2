import { bp } from 'binparse';
import { Diablo2Packet } from '../packet';
import { ClientPacketsPod } from '../packets-pod/client';

const ClientSkillLeftOnEntity = Diablo2Packet.create(0x06, 'ClientSkillLeftOnEntity', {
  type: bp.lu32,
  entityId: bp.lu32,
});

export const ClientPacketsPd2 = {
  ...ClientPacketsPod,
  ClientSkillLeftOnEntity,
};
