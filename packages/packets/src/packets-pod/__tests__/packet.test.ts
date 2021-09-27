import { Act } from '@diablo2/data';
import o from 'ospec';
import {
  GameActLoad,
  GameChat,
  GameStart,
  PlayerAssign,
  PlayerInGame,
  StateSet,
  UnitUseSkill,
  WarpAssign,
} from '../server.js';

// This has really weird formatting in prettier

o.spec('PacketTest', () => {
  o('0x5b - PlayerInGame', () => {
    const playerInGame = PlayerInGame.parse(
      Buffer.from('5b24000100000003646364616400000000000000000000001800ffff0000000000000000', 'hex'),
      { offset: 1, startOffset: 0 },
    );
    o(playerInGame.name).equals('dcdad');
    o(playerInGame.level).equals(24);
    o(playerInGame.unitId).equals(1);
    o(playerInGame.class.id).equals(3);
    o(playerInGame.class.name).equals('Paladin');
  });

  o('0xa8 - SetState', () => {
    const setState = StateSet.parse([168, 0, 1, 0, 0, 0, 12, 105, 0, 172, 252, 15], { offset: 1, startOffset: 0 });
    o(setState.unitId).equals(1);
    o(setState.packetLength).equals(12);
    o(setState.state).equals(105);
    o(setState.stateEffects).deepEquals([0, 172, 252, 15]);
  });

  o('0x26 - GameChat', () => {
    const pkt = Buffer.from(
      '260400020000000001005b61646d696e6973747261746f725d00ff6339475323383a205379646e65792c4155532e20737570706f7274656420627920414345204775696c642020ff633400',
      'hex',
    );

    const ctx = { offset: 1, startOffset: 0 };
    const res = GameChat.parse(pkt, ctx);
    o(res.name).equals('[administrator]');
    o(res.message).equals('ÿc9GS#8: Sydney,AUS. supported by ACE Guild  ÿc4');
    o(ctx.offset).equals(pkt.length);
  });

  o('0x59 - PlayerAssign', () => {
    const playerAssign = PlayerAssign.parse(
      [89, 1, 0, 0, 0, 3, 100, 99, 100, 97, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      { offset: 1, startOffset: 0 },
    );

    o(playerAssign.name).equals('dcdad');
    o(playerAssign.class.name).equals('Paladin');
    o(playerAssign.class.id).equals(3);
    o(playerAssign.x).equals(0);
    o(playerAssign.y).equals(0);
  });

  o('0x03 - LoadAct', () => {
    const loadAct = GameActLoad.parse([3, 2, 1, 0, 0, 0, 2, 0, 3, 0, 0, 0], {
      offset: 1,
      startOffset: 0,
    });
    o(loadAct.act.name).equals(Act[2] as any);
    o(loadAct.act.id).equals(0x02);
    o(loadAct.mapId).equals(1);
    o(loadAct.areaId).equals(2);
    o(loadAct.unk1).equals(3);
  });

  o('0x4d - UnitUseSkill', () => {
    const useSkill = UnitUseSkill.parse([77, 1, 17, 0, 0, 0, 74, 1, 0, 0, 4, 207, 14, 254, 19, 0, 0], {
      offset: 1,
      startOffset: 0,
    });

    o(useSkill.x).equals(3791);
    o(useSkill.y).equals(5118);
  });

  o('0x50 - GameStart', () => {
    const ctx = { offset: 1, startOffset: 0 };
    GameStart.parse([80, 36, 0, 0, 0, 160, 35, 2, 232, 252, 64, 2, 48, 167, 45], ctx);
    o(ctx.offset).equals(15);
  });

  o('0x09 - WarpAssign', () => {
    const ctx = { offset: 1, startOffset: 0 };
    // X,Y near 4683 5101
    const res = WarpAssign.parse([9, 5, 1, 0, 0, 0, 76, 73, 39, 154, 50], ctx);
    o(res.type.name).equals('Warp');
    o(res.warp.id).equals(76);
    o(res.warp.name).equals('Act5TempleEntrance');
  });
});
