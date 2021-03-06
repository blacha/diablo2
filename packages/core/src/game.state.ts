import { Logger } from '@diablo2/bintools';
import { ItemQuality } from '@diablo2/data';
import { PacketsPod } from '@diablo2/packets';
import { ulid } from 'ulid';
import { Diablo2Client } from './client';
import { Diablo2PacketParser } from './packet.parser';
import { Diablo2State } from './state/game';

const { client, server } = PacketsPod;

const PacketIgnore: Set<string> = new Set([
  server.GameLoading.name,
  server.GameObjectAssign.name,
  server.ItemContainerUpdate.name,
  server.MapAdd.name,
  server.MapRemove.name,
  server.NpcGetHit.name,
  server.NpcHeal.name,
  server.ObjectRemove.name,
  server.Pong.name,
  server.Relator1.name,
  server.Relator2.name,
  server.StateDelayed.name,
  server.StateEnd.name,
  server.PlaySound.name,
  server.WarpAssign.name,
  server.GameObjectState.name,
  server.UnitUseSkillOnTarget.name,
  server.StateSet.name,
  server.PlayerCursorClear.name,
  server.MercExperienceByte.name,
  server.MercExperienceWord.name,
]);

const PacketInteresting: Set<string> = new Set([]);

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

  constructor(d2: Diablo2Client, log: Logger) {
    this.log = log;
    this.client = d2;
    this.parser = new Diablo2PacketParser(d2);
    this.state = new Diablo2State(this.id);

    this.parser.on(client.ClientRunToCoOrd, (pkt) => {
      this.state.moveTo(pkt.x, pkt.y);
    });
    this.parser.on(client.ClientWalkToCoOrd, (pkt) => this.state.moveTo(pkt.x, pkt.y));

    this.parser.on(server.GameLogonReceipt, (pkt) => {
      this.state.map.difficulty = pkt.difficulty.id;
      this.state.map.isHardcore = pkt.isHardcore > 0;
      this.log.debug({ difficulty: pkt.difficulty.name }, pkt.packet.name);
      this.state.dirty();
    });

    this.parser.on(server.GameActLoad, (pkt) => {
      this.state.map.id = pkt.mapId;
      this.state.map.act = pkt.act.id;
      this.log.debug({ id: pkt.mapId, act: pkt.act.name }, pkt.packet.name);
      this.state.npc.clear();
      this.state.object.clear();
      this.state.dirty();
    });

    this.parser.on(server.GameUnloadDone, () => this.state.close());

    this.parser.on(server.ExperienceByte, (pkt) => this.state.trackXp(pkt.amount));
    this.parser.on(server.ExperienceWord, (pkt) => this.state.trackXp(pkt.amount));
    this.parser.on(server.ExperienceDWord, (pkt) => this.state.trackXp(pkt.amount, true));

    this.parser.on(server.WalkVerify, (pkt) => this.state.move(this.state.player.id, pkt.x, pkt.y));
    this.parser.on(server.PlayerStop, (pkt) => this.state.move(pkt.unitId, pkt.x, pkt.y));
    this.parser.on(server.PlayerReassign, (pkt) => this.state.move(pkt.unitId, pkt.x, pkt.y));
    this.parser.on(server.PlayerMove, (pkt) => this.state.move(pkt.unitId, pkt.currentX, pkt.currentY));
    this.parser.on(server.PlayerLifeChange, (pkt) => this.state.move(this.state.player.id, pkt.x, pkt.y));

    this.parser.on(server.PlayerInGame, (pkt) => {
      this.state.player.level = pkt.level;
      this.state.player.name = pkt.name;
      this.log.error({ player: this.state.player }, 'PlayerInGame');
      this.state.dirty();
    });

    this.parser.on(server.PlayerAbout, (pkt) => {
      if (pkt.unitId === this.state.player.id) {
        this.state.player.level = pkt.level;
        this.state.dirty();
      }
    });

    this.parser.on(server.ItemActionWorld, (pkt) => {
      if (pkt.code === 'gld') return; // Ignore gold

      if (pkt.action.name === 'AddToGround' || pkt.action.name === 'DropToGround' || pkt.action.name === 'OnGround') {
        if (this.isGoodItem(pkt.code, pkt.quality?.id)) {
          this.log.warn({ code: pkt.code, x: pkt.x, y: pkt.y, item: pkt.name }, 'ItemDropped');
          this.state.trackItem({ ...pkt, updatedAt: Date.now(), name: pkt.name ?? 'Unknown' });
        }
      }
    });

    // Handle NPC Movement
    this.parser.on(server.NpcMove, (pkt) => this.state.move(pkt.unitId, pkt.x, pkt.y));
    this.parser.on(server.NpcAttack, (pkt) => this.state.move(pkt.unitId, pkt.x, pkt.y));
    this.parser.on(server.NpcMoveToTarget, (pkt) => this.state.move(pkt.unitId, pkt.x, pkt.y));
    this.parser.on(server.NpcUpdate, (pkt) => {
      // TODO why are state 8 & 9 = dead?
      if (pkt.state === 0x09 || pkt.state === 0x08) pkt.life = 0;

      // console.log('NpcUpdate', pkt.unitId, pkt.unitLife);
      this.state.move(pkt.unitId, pkt.x, pkt.y, pkt.life);
    });

    this.parser.on(server.NpcAction, () => {
      // ignore for now
      //this.state.move(pkt.unitId, pkt.x, pkt.y)
    });
    this.parser.on(server.NpcStop, (pkt) => {
      // ignore for now
      //this.state.move(pkt.unitId, pkt.x, pkt.y)
    });

    this.parser.on(server.PlayerAssign, (pkt) => {
      this.state.addPlayer(pkt.unitId, pkt.name);
      this.state.move(pkt.unitId, pkt.x, pkt.y);
    });

    this.parser.on(server.NpcAssign, (pkt) => {
      if (pkt.name === 'an evil force') return;
      // console.log(pkt.name);
      this.state.trackNpc({
        id: pkt.unitId,
        name: pkt.name,
        life: pkt.life,
        x: pkt.x,
        y: pkt.y,
        code: pkt.code,
        flags: pkt.flags ?? {},
        updatedAt: Date.now(),
      });
    });
    this.parser.all((pkt) => {
      if (pkt.packet.direction === 'ClientServer') return;
      if (PacketIgnore.has(pkt.packet.name)) return;
      if (this.parser.events.listenerCount(pkt.packet.name) !== 0) return;
      if (PacketInteresting.has(pkt.packet.name)) {
        this.log.trace({ packet: pkt.packet.name, id: pkt.packet.id }, 'Packet');
      } else {
        this.log.trace({ packet: pkt.packet.name, id: pkt.packet.id }, 'Packet');
      }
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

    return false;
  }

  onPacket(direction: 'in' | 'out', bytes: Buffer): void {
    if (direction === 'in') return this.parser.onPacketIn(bytes);
    return this.parser.onPacketOut(bytes);
  }
}
