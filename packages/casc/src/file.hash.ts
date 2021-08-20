import { lookup3 } from './lookup3';

const PathReplace = /\//g;
/**
 * Calculate a normalised file hash as a number
 */
export function fileNameHash(fileName: string): number {
  const searchName = fileName.toUpperCase().replace(PathReplace, '\\');
  const [low, high] = lookup3(Buffer.from(searchName), 0, 0);
  return high * 0x100000000 + low;
}

/**
 * Calculate a normalised file hash as a hex string
 *
 * @example 0x4418b77831f1197c
 */
export function fileNameHashString(fileName: string): string {
  const searchName = fileName.toUpperCase().replace(PathReplace, '\\');
  const [low, high] = lookup3(Buffer.from(searchName), 0, 0);
  return '0x' + high.toString(16) + low.toString(16).padStart(8, '0');
}
