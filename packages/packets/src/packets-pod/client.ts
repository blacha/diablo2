import { Diablo2Packet } from '../packet';
import { bp } from 'binparse';

/** Packets sent by the D2Client */
const WalkToCoOrd = Diablo2Packet.create(0x01, 'WalkToCoOrd', { x: bp.lu16, y: bp.lu16 });
const WalkToUnit = Diablo2Packet.empty(0x02, 'WalkToUnit');
const RunToCoOrd = Diablo2Packet.create(0x03, 'RunToCoOrd', { x: bp.lu16, y: bp.lu16 });
const RunToUnit = Diablo2Packet.empty(0x04, 'RunToUnit');

export const ClientPackets: Diablo2Packet<any>[] = [WalkToCoOrd, WalkToUnit, RunToCoOrd, RunToUnit];
