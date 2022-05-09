import o from 'ospec';
import { getNpcFlags } from '../npc.js';

o.spec('NpcFlags', () => {
  o('should ignore weird values', () => {
    o(getNpcFlags(-1)).deepEquals({ isNormal: true });
    o(getNpcFlags(372)).deepEquals({ isNormal: true });
  });

  o('should get all the flags', () => {
    o(getNpcFlags(0b11111111)).deepEquals({
      isNormal: false,
      isSuperUnique: true,
      isChampion: true,
      isUnique: true,
      isMinion: true,
      isPossessed: true,
      isGhostly: true,
    });
  });

  o('should get some flags', () => {
    o(getNpcFlags(0b1010101)).deepEquals({ isNormal: false, isChampion: true, isMinion: true, isGhostly: true });
  });
});
