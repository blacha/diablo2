export interface PacketLine {
  direction: 'in' | 'out';
  time: number;
  bytes: string;
}
