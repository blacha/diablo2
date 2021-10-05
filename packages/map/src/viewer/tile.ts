import { Act } from '@diablo2/data/src/act.js';
import { Difficulty } from '@diablo2/data/src/difficulty.js';
import { toHex } from 'binparse/build/src/hex.js';
import { LruCache } from '../map/lru.js';
import { Diablo2Map, MapRouteResponse } from '../map/map.js';
import { AreaUtil } from './area.js';
import { Bounds, MapBounds } from './bounds.js';

export interface MapParams {
  seed: number;
  difficulty: number;
  act: number;
  x: number;
  y: number;
  z: number;
}

export class MapTiles {
  static MapHost = 'https://diablo2.chard.dev';

  static tiles = new LruCache<Promise<unknown>>(1024);
  static maps = new LruCache<Promise<MapData>>(32);

  static url(difficulty: Difficulty, seed: number): string {
    return `v1/map/${seed}/${Difficulty[difficulty]}.json`;
  }

  static get(difficulty: Difficulty, seed: number): Promise<MapData> {
    const mapId = [toHex(difficulty, 8), seed].join('__');
    let existing = this.maps.get(mapId);
    if (existing == null) {
      existing = this.fetch(difficulty, seed);
      this.maps.set(mapId, existing);
    }
    return existing;
  }

  static async fetch(difficulty: Difficulty, seed: number): Promise<MapData> {
    const path = MapTiles.url(difficulty, seed);
    const url = `${MapTiles.MapHost}/${path}`;
    console.log('Fetching', { url });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${url} - ${res.status} - ${res.statusText}`);

    const json = await res.json();
    return new MapData(json);
  }

  static getVector(d: MapParams): Promise<unknown> {
    const tileId = ['vector', toHex(d.difficulty, 8), Act[d.act], d.seed, d.z, d.x, d.y].join('__');
    let existing = this.tiles.get(tileId);
    if (existing == null) {
      const startTime = Date.now();
      existing = this.tileVector(d);

      existing.then((r) => {
        if (r) console.log(tileId, { duration: Date.now() - startTime });
      });
      this.tiles.set(tileId, existing);
    }
    return existing;
  }
  static async tileVector(d: MapParams): Promise<unknown | void> {
    console.log('Tile', d);
    return;
  }

  static getRaster(d: MapParams): Promise<unknown> {
    const tileId = ['raster', toHex(d.difficulty, 8), Act[d.act], d.seed, d.z, d.x, d.y].join('__');
    let existing = this.tiles.get(tileId);
    if (existing == null) {
      const startTime = Date.now();
      existing = this.tileRaster(d);

      existing.then((r) => {
        if (r) console.log(tileId, { duration: Date.now() - startTime });
      });
      this.tiles.set(tileId, existing);
    }
    return existing;
  }

  static async tileRaster(d: MapParams): Promise<ArrayBuffer | void> {
    const map = await this.get(d.difficulty, d.seed);

    const bounds = MapBounds.tileToSourceBounds(d.x, d.y, d.z);
    const zones = map.findMaps(d.act, bounds);

    if (zones.length === 0) return;

    const canvas = document.createElement('canvas') as HTMLCanvasElement;

    const scale = MapBounds.getScale(d.z);

    canvas.width = MapBounds.TileSize * 2;
    canvas.height = MapBounds.TileSize * 2;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    for (const zone of zones) map.render(zone, ctx, bounds, (1 / scale) * 2);

    const blob: Blob | null = await new Promise((r) => canvas.toBlob((b) => r(b), 'image/png'));
    if (blob == null) return;
    return blob.arrayBuffer();
  }
}

class MapData {
  data: MapRouteResponse;
  zones: Map<number, Diablo2Map> = new Map();
  constructor(data: MapRouteResponse) {
    this.data = data;
    for (const map of Object.values(this.data.maps)) {
      this.zones.set(map.id, map);
    }
  }

  static isMapInBounds(mapInfo: Diablo2Map, bounds: Bounds): boolean {
    if (mapInfo.offset.x + mapInfo.size.width < bounds.x) return false;
    if (mapInfo.offset.y + mapInfo.size.height < bounds.y) return false;
    if (mapInfo.offset.x > bounds.x + bounds.width) return false;
    if (mapInfo.offset.y > bounds.y + bounds.height) return false;
    return true;
  }

  findMaps(act: Act, bounds: Bounds): Diablo2Map[] {
    const output: Diablo2Map[] = [];
    for (const map of this.zones.values()) {
      const mapAct = AreaUtil.getActLevel(map.id);
      if (mapAct !== act) continue;
      if (!MapData.isMapInBounds(map, bounds)) continue;
      output.push(map);
    }

    return output;
  }

  render(zone: Diablo2Map, ctx: CanvasRenderingContext2D, bounds: Bounds, scale = 0.5): void {
    ctx.fillStyle = 'white';
    const map = zone.map;

    for (let yOffset = 0; yOffset < map.length; yOffset++) {
      const line = map[yOffset];
      let fill = false;
      if (line.length === 0) continue;

      if (zone.offset.y + yOffset < bounds.y) continue;

      let x = zone.offset.x - bounds.x;
      const y = zone.offset.y - bounds.y + yOffset;

      for (let i = 0; i < line.length; i++) {
        const xCount = line[i];

        fill = !fill;
        if (!fill) {
          const width = xCount * scale;
          if (width >= 0.2) ctx.fillRect(x * scale, y * scale, width, scale);
        }
        x = x + xCount;
      }
      const xMax = zone.offset.x - bounds.x + zone.size.width;
      if (fill && x < xMax) ctx.fillRect(x * scale, y * scale, (xMax - x) * scale, scale);
    }
  }
}
