import { Diablo2Packets } from '../packet';
import { ClientPackets } from './client';
import { ServerPacketsPod } from './server';

export const PacketsPod: Diablo2Packets = {
  client: ClientPackets,
  server: ServerPacketsPod,
};
