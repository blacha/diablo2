import { Diablo2Packets } from '../packet';
import { ClientPacketsPod } from './client';
import { ServerPacketsPod } from './server';

export const PacketsPod: Diablo2Packets = {
  client: ClientPacketsPod,
  server: ServerPacketsPod,
};
