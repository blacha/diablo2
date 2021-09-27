import { Diablo2Version } from '@diablo2/data';
import { Diablo2Packets } from './packet.js';
import { PacketsPd2 } from './packets-pd2/index.js';
import { PacketsPod } from './packets-pod/index.js';

export function getDiabloPackets(version: Diablo2Version): Diablo2Packets {
  switch (version) {
    case Diablo2Version.PathOfDiablo:
      return PacketsPod;
    case Diablo2Version.ProjectDiablo2:
      return PacketsPd2;
    default:
      throw new Error(`Unable to load packets for version: ${version}`);
  }
}
