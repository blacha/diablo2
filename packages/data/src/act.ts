export enum Act {
  ActI = 0,
  ActII = 1,
  ActIII = 2,
  ActIV = 3,
  ActV = 4,
}

/** LevelCode => Act @see ActUtil.fromLevel */
export const ActLevels = {
  ActI: 40,
  ActII: 75,
  ActIII: 103,
  ActIV: 109,
  ActV: 142,
};

export const ActUtil = {
  fromLevel(code: number): Act {
    if (code < ActLevels.ActI) return Act.ActI;
    if (code < ActLevels.ActII) return Act.ActII;
    if (code < ActLevels.ActIII) return Act.ActIII;
    if (code < ActLevels.ActIV) return Act.ActIV;
    if (code < ActLevels.ActV) return Act.ActV;
    return Act.ActV;
  },

  fromString(f?: string | null): Act | null {
    if (f == null) return null;
    const num = Number(f);
    if (!isNaN(num)) {
      if (num in Act) return num;
      return null;
    }
    switch (f.toLowerCase()) {
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
};
