export enum Difficulty {
  Normal = 0,
  Nightmare = 1,
  Hell = 2,
}

export const DifficultyUtil = {
  fromString(f?: string | null): Difficulty | null {
    if (f == null) return null;
    const num = Number(f);
    if (!isNaN(num)) {
      if (num in Difficulty) return num;
      return null;
    }
    switch (f.toLowerCase()) {
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
