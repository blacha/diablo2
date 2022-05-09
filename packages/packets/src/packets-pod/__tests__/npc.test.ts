import { Diablo2Mpq, NpcEnchant } from '@diablo2/data';
import o from 'ospec';
import { NpcAssign } from '../server.js';

const fakeMonster = (id: number): { id: number; nameLangId: number; baseId: number } => {
  return { id, nameLangId: id, baseId: id };
};

o.spec('NpcAssign', () => {
  o.beforeEach(async () => {
    Diablo2Mpq.reset();
    // Hungry Dead
    Diablo2Mpq.lang.classic.add('Hungry', 6, 'Hungry Dead');
    Diablo2Mpq.monsters.add(6, fakeMonster(6));
    Diablo2Mpq.monsters.addState(6, [3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0]);

    // Fallen
    Diablo2Mpq.lang.classic.add('Fallen', 19, 'Fallen');
    Diablo2Mpq.monsters.add(19, fakeMonster(19));
    Diablo2Mpq.monsters.addState(19, [0, 1, 0, 0, 0, 3, 0, 4, 2, 1, 0, 0, 0, 0, 0, 1]);

    // Rakanishu
    Diablo2Mpq.monsters.add(20, fakeMonster(20));
    Diablo2Mpq.monsters.addState(20, [0, 1, 0, 0, 0, 3, 0, 4, 2, 1, 0, 0, 0, 0, 0, 1]);
    Diablo2Mpq.monsters.superUniques[3] = 'Rakanishu';

    // Eldritch
    Diablo2Mpq.monsters.add(453, fakeMonster(453));
    Diablo2Mpq.monsters.addState(453, [1, 1, 0, 0, 0, 3, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0]);
    Diablo2Mpq.monsters.superUniques[49] = 'Eldritch the Rectifier';

    // Strangler
    Diablo2Mpq.monsters.add(305, fakeMonster(305));
    Diablo2Mpq.monsters.addState(305, [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);

    // Pindle
    Diablo2Mpq.monsters.add(440, fakeMonster(440));
    Diablo2Mpq.monsters.addState(440, [2, 2, 2, 2, 2, 1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0]);

    // if (process.env.DIABLO2_PATH) {
    //   if (process.env['DIABLO2_PATH']) await Diablo2MpqLoader.load(process.env['DIABLO2_PATH'], undefined, Diablo2Mpq);
    // }
  });

  o('should load a hungry dead', () => {
    const npc = NpcAssign.raw(Buffer.from('acc400000006005514fd13801131400400', 'hex'));
    o(npc.unitId).equals(196);
    o(npc.code).equals(6);
    o(npc.x).equals(5205);
    o(npc.y).equals(5117);
    o(npc.life).equals(128);
    o(npc.name).equals('Hungry Dead');
    o(npc.isNormal).equals(true);
  });

  o('should parse a champion hungry dead', () => {
    const npc = NpcAssign.raw(
      Buffer.from('aca900000006005f14b6137d16512158e03801e09601a701a900000069006da9000000', 'hex'),
    );
    o(npc.isChampion).equals(true);
    o(npc.isUnique).equals(true);
    o(npc.name).equals('Hungry Dead');
  });

  o('should parse a low health fallen', () => {
    const npc = NpcAssign.raw(Buffer.from('ace70000001300b114e4102a1111c80000', 'hex'));
    o(npc.life).equals(42);
  });

  o('should parse super unique Rakanishu', () => {
    const npc = NpcAssign.raw(Buffer.from('acc500000014003b14eb138019110480660020c2c002207219', 'hex'));

    o(npc.x).equals(5179);
    o(npc.y).equals(5099);
    o(npc.life).equals(128);
    o(npc.code).equals(20);
    o(npc.name).equals('Rakanishu');
    o(npc.isSuperUnique).equals(true);
    o(npc.isUnique).equals(true); // .deepEquals({ isSuperUnique: true, isUnique: true });
  });

  const NpcEnchants = [
    { npc: 'ac1a000000c501910ec3138018a189010830c8b000786d01', enchants: [NpcEnchant.Fast, NpcEnchant.ManaBurn] },
    { npc: 'ac0f000000c501910ec313801a1108401303106090610160bd04', enchants: [NpcEnchant.Fast, NpcEnchant.ManaBurn] },
    { npc: 'ac12000000c501910ec313801a1120401303106050600140f90e', enchants: [NpcEnchant.Fast, NpcEnchant.Strong] },
    { npc: 'ac0e000000c501910ec313801a11244013031060706001407f05', enchants: [NpcEnchant.Fast, NpcEnchant.Cursed] },
    { npc: 'ac0f000000c501910ec3138017a189010830b000f83603', enchants: [NpcEnchant.Fast] },
    { npc: 'ac0c000000c501910ec313801a11044013031060106101601e01', enchants: [NpcEnchant.Fast, NpcEnchant.Lightning] },
    { npc: 'ac0c000000c501910ec313801a11284013031060a0610150c20e', enchants: [NpcEnchant.Fast, NpcEnchant.Teleport] },
    { npc: 'ac0c0200003101b91efc178013a1280088d805', enchants: [NpcEnchant.Strong] },
    { npc: 'ac4e000000b8014a279f33801ab162a0a1011049d8b000a03800', enchants: [NpcEnchant.Fire, NpcEnchant.Spectral] },
  ];

  for (const test of NpcEnchants) {
    o(`should parse enchant ${test.npc} to ${test.enchants}`, () => {
      const npc = NpcAssign.raw(Buffer.from(test.npc, 'hex'));
      for (const id of test.enchants) {
        o(npc.enchants?.find((f) => f.id === id)).notEquals(undefined)(
          'Should find Enchant: ' + NpcEnchant[id] + ':' + id,
        );
      }
    });
  }
});
