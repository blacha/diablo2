import { UInt16 } from '../data.types';
import { Diablo2Packet } from '../packet';

/** Packets sent by the D2Client */
const WalkToCoOrd = new Diablo2Packet(0x01, 'WalkToCoOrd', { x: UInt16, y: UInt16 });
const WalkToUnit = new Diablo2Packet(0x02, 'WalkToUnit', {});
const RunToCoOrd = new Diablo2Packet(0x03, 'RunToCoOrd', { x: UInt16, y: UInt16 });
const RunToUnit = new Diablo2Packet(0x04, 'RunToUnit', {});

export const ClientPackets = [WalkToCoOrd, WalkToUnit, RunToCoOrd, RunToUnit];
