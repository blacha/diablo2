import { Act } from '@diablo2/data';
import o from 'ospec';
import { LoadAct, PlayerAssign, PlayerInGame, SetState } from '..';

// This has really weird formatting in prettier
const PlayerInGamePacket = [
  [91, 36, 0, 1, 0, 0, 0, 3, 100, 99, 100, 97, 100],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0],
].reduce((acc, val) => acc.concat(val), []);

o.spec('PacketTest', () => {
  o('0x5b - PlayerInGame', () => {
    const playerInGame = PlayerInGame.parse(PlayerInGamePacket, { offset: 1, startOffset: 0 });

    o(playerInGame.name).equals('dcdad');
    o(playerInGame.level).equals(24);
    o(playerInGame.playerId).equals(1);
    o(playerInGame.charType.value).equals(3);
    o(playerInGame.charType.name).equals('Paladin');
  });

  o('0xa8 - SetState', () => {
    const setState = SetState.parse([168, 0, 1, 0, 0, 0, 12, 105, 0, 172, 252, 15], { offset: 1, startOffset: 0 });
    o(setState.unitId).equals(1);
    o(setState.packetLength).equals(12);
    o(setState.state).equals(105);
    o(setState.stateEffects).deepEquals([0, 172, 252, 15]);
  });

  o('0x59 - PlayerAssign', () => {
    const playerAssign = PlayerAssign.parse(
      [89, 1, 0, 0, 0, 3, 100, 99, 100, 97, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      { offset: 1, startOffset: 0 },
    );

    o(playerAssign.name).equals('dcdad');
    o(playerAssign.type.name).equals('Paladin');
    o(playerAssign.type.value).equals(3);
    o(playerAssign.x).equals(0);
    o(playerAssign.y).equals(0);
  });

  o('0x03 - LoadAct', () => {
    const loadAct = LoadAct.parse([0x03, 0x02], { offset: 1, startOffset: 0 });
    o(loadAct.act.name).equals(Act[0x02] as any);
    o(loadAct.act.value).equals(0x02);
  });
});
