export class MapBounds {
  static Size = 2 ** 14;
  static TileSize = 256;

  static tileToPixels(tX: number, tY: number): { x: number; y: number } {
    return { x: tX * this.TileSize, y: tY * this.TileSize };
  }
  static tileToSourceBounds(tX: number, tY: number, tZ: number): Bounds {
    const scale = this.getScale(tZ);
    const size = scale * MapBounds.TileSize;
    return { x: tX * size, y: tY * size, width: size, height: size };
  }
  static getScale(z: number): number {
    return MapBounds.Size / (2 ** z * MapBounds.TileSize);
  }
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
