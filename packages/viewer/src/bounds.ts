export const WebMercatorBounds = 20037500;
export const EarthRadius = 6378137;
const RadToDeg = 180 / Math.PI;

export class LevelBounds {
  static Size = 2 ** 15;
  static TileSize = 256;

  static tileToPixels(tX: number, tY: number): { x: number; y: number } {
    return { x: tX * this.TileSize, y: tY * this.TileSize };
  }
  static tileToSourceBounds(tX: number, tY: number, tZ: number): Bounds {
    const scale = this.getScale(tZ);
    const size = scale * LevelBounds.TileSize;
    return { x: tX * size, y: tY * size, width: size, height: size };
  }

  static sourceToLatLng(sX: number, sY: number): { lat: number; lng: number } {
    const wm = LevelBounds.sourceToWebMercator(sX, sY);
    return LevelBounds.webMercatorToLatLong(wm.x, wm.y);
  }

  // Map the map bounding box into EPSG:3857 WebMercator so it can be transformed into a lat lng
  static sourceToWebMercator(sX: number, sY: number): { x: number; y: number } {
    const halfSize = LevelBounds.Size / 2;
    const x = ((sX - halfSize) / halfSize) * WebMercatorBounds;
    const y = ((halfSize - sY) / halfSize) * WebMercatorBounds;
    return { x, y };
  }

  static webMercatorToLatLong(wX: number, wY: number): { lat: number; lng: number } {
    const lat = (Math.PI * 0.5 - 2.0 * Math.atan(Math.exp(-wY / EarthRadius))) * RadToDeg;
    return { lat, lng: (wX * RadToDeg) / EarthRadius };
  }

  static getScale(z: number): number {
    return LevelBounds.Size / (2 ** z * LevelBounds.TileSize);
  }
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LonLat {
  lat: number;
  lon: number;
}

export interface MapLocation extends LonLat {
  zoom: number;
}
