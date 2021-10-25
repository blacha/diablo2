export enum Diablo2Version {
  Classic = 'Classic',
  Resurrected = 'Resurrected',
  PathOfDiablo = 'PathOfDiablo',
  ProjectDiablo2 = 'ProjectDiablo2',
}

/**
 * Attempt to determine the diablo2 game type from game path
 * @param gamePath
 */
export function getDiabloVersion(gamePath: string): Diablo2Version {
  const lowerPath = gamePath.toLowerCase();
  if (lowerPath.includes('projectd2')) return Diablo2Version.ProjectDiablo2;
  if (lowerPath.includes('path of diablo')) return Diablo2Version.PathOfDiablo;
  throw new Error(`Unknown game version : ${gamePath}`);
}
