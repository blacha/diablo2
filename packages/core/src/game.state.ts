import { Logger } from '@diablo2/bintools';
import { ItemQuality } from '@diablo2/data';
import { PacketsPod } from '@diablo2/packets';
import { ulid } from 'ulid';
import { Diablo2Client } from './client';
import { Diablo2PacketParser } from './packet.parser';
import { Diablo2State } from './state/game';

export class Diablo2GameSession {
  id: string = ulid().toLowerCase();
  client: Diablo2Client;
  parser: Diablo2PacketParser;

  state: Diablo2State;
  log: Logger;

  itemTrack = new Set([
    // Charms
    'cm1',
    'cm2',
    'cm3',

    // OOC
    'cx5',
    'cx8',

    // Keys
    'pk1',
    'pk2',
    'pk3',
  ]);

  constructor(client: Diablo2Client, log: Logger) {
    this.log = log;
    this.client = client;
    this.parser = new Diablo2PacketParser(client);
    this.state = new Diablo2State(this.id);

    this.parser.on(PacketsPod.server.GameLogonReceipt, (pkt) => {
      this.state.map.difficulty = pkt.difficulty.id;
      this.state.map.isHardcore = pkt.isHardcore > 0;
      this.state.dirty();
    });

    this.parser.on(PacketsPod.server.GameActLoad, (pkt) => {
      this.state.map.id = pkt.mapId;
      this.state.map.act = pkt.act.id;
      this.state.npc.clear();
      this.state.object.clear();
      this.state.dirty();
    });

    this.parser.on(PacketsPod.server.GameUnloadDone, () => this.state.close());

    this.parser.on(PacketsPod.server.ExperienceByte, (pkt) => this.state.trackXp(pkt.amount));
    this.parser.on(PacketsPod.server.ExperienceWord, (pkt) => this.state.trackXp(pkt.amount));
    this.parser.on(PacketsPod.server.ExperienceDWord, (pkt) => this.state.trackXp(pkt.amount, true));

    this.parser.on(PacketsPod.server.WalkVerify, (pkt) => this.state.move(this.state.player.id, pkt.x, pkt.y));
    this.parser.on(PacketsPod.server.PlayerStop, (pkt) => this.state.move(pkt.unitId, pkt.x, pkt.y));
    this.parser.on(PacketsPod.server.PlayerReassign, (pkt) => this.state.move(pkt.unitId, pkt.x, pkt.y));
    this.parser.on(PacketsPod.server.PlayerMove, (pkt) => this.state.move(pkt.unitId, pkt.currentX, pkt.currentY));
    this.parser.on(PacketsPod.server.PlayerLifeChange, (pkt) => this.state.move(this.state.player.id, pkt.x, pkt.y));

    this.parser.on(PacketsPod.server.PlayerInGame, (pkt) => {
      this.state.player.level = pkt.level;
      this.state.dirty();
    });
    this.parser.on(PacketsPod.server.PlayerAbout, (pkt) => {
      if (pkt.unitId === this.state.player.id) {
        this.state.player.level = pkt.level;
        this.state.dirty();
      }
    });

    this.parser.on(PacketsPod.server.ItemActionWorld, (pkt) => {
      if (pkt.code === 'gld') return; // Ignore gold

      if (pkt.action.name === 'AddToGround' || pkt.action.name === 'DropToGround' || pkt.action.name === 'OnGround') {
        if (this.isGoodItem(pkt.code, pkt.quality?.id)) {
          this.log.warn({ code: pkt.code, x: pkt.x, y: pkt.y }, 'ItemDropped');
          this.state.trackItem({ ...pkt, updatedAt: Date.now(), name: pkt.name ?? 'Unknown' });
        }
      }
    });

    this.parser.on(PacketsPod.server.PlayerAssign, (pkt) => {
      this.state.addPlayer(pkt.unitId, pkt.name);
      this.state.move(pkt.unitId, pkt.x, pkt.y);
      this.state.dirty();
    });

    this.parser.all((pkt) => {
      console.log(pkt.packet.id, pkt.packet.name);
    });
  }

  isGoodItem(code: string, quality: ItemQuality): boolean {
    if (this.itemTrack.has(code)) return true;
    if (code.match(/(r[0-9][0-9])/)) return true;
    if (quality === ItemQuality.Set) return true;
    if (quality === ItemQuality.Unique) return true;

    if (code === 'gld') return false;
    if (quality === ItemQuality.NotApplicable) return false;
    if (quality === ItemQuality.Normal) return false;

    return true;
  }

  onPacket(direction: 'in' | 'out', bytes: Buffer): void {
    if (direction === 'in') return this.parser.onPacketIn(bytes);
    return this.parser.onPacketOut(bytes);
  }
}
