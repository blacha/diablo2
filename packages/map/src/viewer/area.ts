import { Act } from '@diablo2/data/src/act.js';
import { Difficulty } from '@diablo2/data/src/difficulty';

const ActLevels = {
  ActI: 40,
  ActII: 75,
  ActIII: 103,
  ActIV: 109,
  ActV: 142,
};

export const AreaUtil = {
  getActLevel(code: number): Act {
    if (code < ActLevels.ActI) return Act.ActI;
    if (code < ActLevels.ActII) return Act.ActII;
    if (code < ActLevels.ActIII) return Act.ActIII;
    if (code < ActLevels.ActIV) return Act.ActIV;
    if (code < ActLevels.ActV) return Act.ActV;
    return Act.ActV;
  },

  getAct(f?: string | null): Act | null {
    if (f == null) return null;
    switch (f?.toLowerCase()) {
      case 'acti':
        return Act.ActI;
      case 'actii':
        return Act.ActII;
      case 'actiii':
        return Act.ActIII;
      case 'activ':
        return Act.ActIV;
      case 'actv':
        return Act.ActV;
    }
    return null;
  },

  getDifficulty(f?: string | null): Difficulty | null {
    if (f == null) return null;
    const num = Number(f);
    if (!isNaN(num)) {
      if (num in Difficulty) return num;
      return null;
    }
    switch (f?.toLowerCase()) {
      case 'normal':
        return Difficulty.Normal;
      case 'nightmare':
        return Difficulty.Nightmare;
      case 'hell':
        return Difficulty.Hell;
      default:
        return null;
    }
  },
};
