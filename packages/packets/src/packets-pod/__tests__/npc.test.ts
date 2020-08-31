import o from 'ospec';
import { NpcAssign } from '../server';

o.spec('NpcAssign', () => {
  o('should load a hungry dead', () => {
    const npc = NpcAssign.parse(Buffer.from('acc400000006005514fd13801131400400', 'hex'), {
      startOffset: 0,
      offset: 1,
    });
    o(npc.unitId).equals(196);
    o(npc.x).equals(5205);
    o(npc.y).equals(5117);
    o(npc.life).equals(128);
  });

  o('should parse a low health fallen', () => {
    const npc = NpcAssign.parse(Buffer.from('ace70000001300b114e4102a1111c80000', 'hex'), {
      startOffset: 0,
      offset: 1,
    });
    o(npc.life).equals(42);
  });
  o('should parse super unique Rakanishu', () => {
    const npc = NpcAssign.parse(Buffer.from('acc500000014003b14eb138019110480660020c2c002207219', 'hex'), {
      startOffset: 0,
      offset: 1,
    });

    o(npc.x).equals(5179);
    o(npc.y).equals(5099);
    o(npc.life).equals(128);
    o(npc.code).equals(20);
  });
});
