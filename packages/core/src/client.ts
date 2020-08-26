import { Diablo2PacketFactory, Diablo2Packets } from '@diablo2/packets';
import { Diablo2GameSession } from './game.state';

export class Diablo2Client {
  clientToServer = new Diablo2PacketFactory();
  serverToClient = new Diablo2PacketFactory();

  constructor(packets: Diablo2Packets) {
    for (const packet of packets.client) this.clientToServer.register(packet);
    for (const packet of packets.server) this.serverToClient.register(packet);

    // this.parser.on(p.GameObjectAssign, (pkt) =>
    //   // this.idStore(pkt.objectId, `GameObjectAssign-${pkt.x}-${pkt.y}__${pkt.objectType}`),
    // );

    // // this.parser.on(p.GameObjectAssign, (pkt) => console.log('GameObjectAssign', pkt.objectId));
    // this.parser.on(p.GameLogonReceipt, (pkt) => console.log('GameLogin', pkt.packet));
    // this.parser.on(p.GameActLoad, (pkt) => console.log('GameActLoad', { seed: pkt.mapId }));
    // this.parser.on(p.GameUnloadDone, (pkt, i) => console.log('GameUnloadDone', pkt.packet, i));
    // this.parser.on(p.PlayerAssign, (pkt, i) =>
    //   console.log('PlayerAssign', { name: pkt.name, class: pkt.class.name, id: pkt.unitId }),
    // );

    // // this.parser.on(p.PartyRefresh, (pkt, i) => console.log('PartyRefresh', pkt));
    // // this.parser.on(p.PlayerStop, (pkt) => console.log('PlayerStop', { id: pkt.unitId }));
    // // this.parser.on(p.GameChat, (pkt) => console.log('GameChat', { name: pkt.name, msg: pkt.message }));
    // // this.parser.on(p.UnitUseSkill, (pkt) => console.log('UnitUseSkill', { id: pkt.unitId }));
    // this.parser.on(p.PlayerInGame, (pkt) =>
    //   console.log('PlayerInGame', {
    //     id: pkt.unitId,
    //     name: pkt.name,
    //     class: pkt.class.name,
    //     level: pkt.level,
    //     partyId: pkt.partyId,
    //   }),
    // );
    // // this.parser.on(p.PlayerKillCount, (pkt) =>
    // //   console.log('PlayerKillCount', { playerId: pkt.playerId, count: pkt.count }),
    // // );,

    // // this.parser.on(p.NpcMove, (pkt) => this.idStore(pkt.unitId, `NpcMove-${pkt.x}-${pkt.y}`));
    // // this.parser.on(p.NpcMoveToTarget, (pkt) => this.idStore(pkt.unitId, `NpcMoveToTarget-${pkt.x}-${pkt.y}`));
    // // this.parser.on(p.NpcUpdate, (pkt) => this.idStore(pkt.unitId, `NpcUpdate-${pkt.x}-${pkt.y}`));
    // // this.parser.on(p.NpcAction, (pkt) => this.idStore(pkt.unitId, `NpcAction-${pkt.x}-${pkt.y}`));
    // // this.parser.on(p.NpcAttack, (pkt) => this.idStore(pkt.unitId, `NpcAttack-${pkt.x}-${pkt.y}`));
    // // // this.parser.on(p.NpcGetHit, (pkt) => this.idStore(pkt.unitId, `NpcGetHit-${pkt.x}-${pkt.y}`));
    // // this.parser.on(p.NpcStop, (pkt) => this.idStore(pkt.unitId, `NpcStop-${pkt.x}-${pkt.y}`));
    // // this.parser.on(p.PlayerAbout, (pkt) => this.idStore(pkt.unitId, `PlayerAbout-`));
    // // this.parser.on(p.PlayerInProximity, (pkt) => this.idStore(pkt.unitId, `PlayerInProximity-`));
    // // this.parser.on(p.PartyMemberUpdate, (pkt) => this.idStore(pkt.unitId, `PartyMemberUpdate-`));
    // // // this.parser.on(p.MercAssign, (pkt) => this.idStore(pkt.mercId, 'MercAssign'));
    // // this.parser.on(p.PartyPlayerAssign, (pkt) => this.idStore(pkt.playerId, `PartyPlayerAssign-`));
    // // this.parser.on(p.PartyMemberPulse, (pkt) => this.idStore(pkt.playerId, `PartyMemberPulse-${pkt.x}-${pkt.y}`));
    // this.parser.on(p.NpcAssign, (pkt) => {
    //   if (pkt.unitId > 10) return;
    //   console.log('NpcAssign', pkt.unitId, NpcName[pkt.code]);
    // });
    // this.parser.on(p.GameObjectAssign, (pkt) => this.idStore(pkt.objectId, `GameObjectAssign-${pkt.x}-${pkt.y}`));
  }

  startSession(): Diablo2GameSession {
    return new Diablo2GameSession(this);
  }
}
