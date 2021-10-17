import { Act } from '@diablo2/data/src/act.js';
import { Difficulty } from '@diablo2/data/src/difficulty.js';
import { toHex } from 'binparse/build/src/hex.js';
import { LruCache } from '../map/lru.js';
import { Diablo2Map, MapRouteResponse } from '../map/map.js';
import { AreaUtil } from './area.js';
import { Bounds, MapBounds } from './bounds.js';
import { MapRender } from './render.js';

export interface MapParams {
  seed: number;
  difficulty: number;
  act: number;
  x: number;
  y: number;
  z: number;
}

process = typeof process === 'undefined' ? ({ env: {} } as any) : process;
export class MapTiles {
  static MapHost = process.env.MAP_HOST ?? 'https://diablo2.chard.dev';

  static tiles = new LruCache<Promise<unknown>>(1024);
  static maps = new LruCache<Promise<MapData>>(32);

  static url(difficulty: Difficulty, seed: number, act: number): string {
    return `v1/map/${toHex(seed, 8)}/${Difficulty[difficulty]}/${Act[act]}.json`;
  }

  static get(difficulty: Difficulty, seed: number, act: number): Promise<MapData> {
    const mapId = [difficulty, toHex(seed, 8), act].join('__');
    let existing = this.maps.get(mapId);
    if (existing == null) {
      existing = this.fetch(difficulty, seed, act);
      this.maps.set(mapId, existing);
    }
    return existing;
  }

  static async fetch(difficulty: Difficulty, seed: number, act: number): Promise<MapData> {
    const path = MapTiles.url(difficulty, seed, act);
    const url = `${MapTiles.MapHost}/${path}`;
    console.log('Fetching', { url });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${url} - ${res.status} - ${res.statusText}`);

    const json = await res.json();
    return new MapData(json);
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
    const map = await this.get(d.difficulty, d.seed, d.act);

    const bounds = MapBounds.tileToSourceBounds(d.x, d.y, d.z);
    const zones = map.findMaps(d.act, bounds);

    if (zones.length === 0) return;

    const canvas = document.createElement('canvas') as HTMLCanvasElement;

    const scale = MapBounds.getScale(d.z);

    canvas.width = MapBounds.TileSize * 2;
    canvas.height = MapBounds.TileSize * 2;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    for (const zone of zones) MapRender.render(zone, ctx, bounds, (1 / scale) * 2);

    const blob: Blob | null = await new Promise((r) => canvas.toBlob((b) => r(b), 'image/png'));
    if (blob == null) return;
    return blob.arrayBuffer();
  }
}

export class MapData {
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
}
