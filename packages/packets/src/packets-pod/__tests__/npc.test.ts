import { Diablo2Mpq } from '@diablo2/data';
import o from 'ospec';
import { NpcAssign } from '../server';

const fakeMonster = (id: number) => {
  return { id, nameLangId: id, baseId: id };
};

o.spec('NpcAssign', () => {
  o.beforeEach(() => {
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
  });

  o('should load a hungry dead', () => {
    const npc = NpcAssign.raw(Buffer.from('acc400000006005514fd13801131400400', 'hex'));
    o(npc.unitId).equals(196);
    o(npc.code).equals(6);
    o(npc.x).equals(5205);
    o(npc.y).equals(5117);
    o(npc.life).equals(128);
    o(npc.name).equals('Hungry Dead');
    o(npc.flags).equals(undefined);
  });

  o('should parse a champion hungry dead', () => {
    const npc = NpcAssign.raw(
      Buffer.from('aca900000006005f14b6137d16512158e03801e09601a701a900000069006da9000000', 'hex'),
    );
    o(npc.flags).deepEquals({ isChampion: true, isUnique: true });
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
    o(npc.flags).deepEquals({ isSuperUnique: true, isUnique: true });
  });

  // o('should parse super unique Griswold', () => {
  //   const npc = NpcAssign.raw(Buffer.from('ac910000006d013b6236148017a129003828b00028e903', 'hex'));
  // });

  // o('should parse unique hell bovine', () => {
  //   const npc = NpcAssign.raw(Buffer.from('acf800000087017762df168016110440b1610000dc0d', 'hex'));
  // });

  // o.only('should parse a vile archer', () => {
  //   const npc = NpcAssign.raw(Buffer.from('ac2700000065027d0ee21300121c15aa0000', 'hex'));
  // });
});
