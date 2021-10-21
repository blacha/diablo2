import { Act, ActUtil, Diablo2Level, Diablo2Map } from '@diablo2/data';
import { Difficulty, LruCache } from '@diablo2/data/';
import { toHex } from 'binparse';
import { Bounds, LevelBounds } from './bounds.js';
import { LevelRender } from './render.js';

export interface MapParams {
  seed: number;
  difficulty: number;
  act: number;
  x: number;
  y: number;
  z: number;
  rasterFillColor: string;
}

process = typeof process === 'undefined' ? ({ env: {} } as any) : process;
/** Load and create tiles from a remote map host */
export class Diablo2MapTiles {
  static MapHost = process.env.MAP_HOST ?? 'https://diablo2.chard.dev';

  static tiles = new LruCache<Promise<unknown>>(1024);
  static maps = new LruCache<Promise<LevelData>>(32);

  static url(difficulty: Difficulty, seed: number, act: number): string {
    return `v1/map/${toHex(seed, 8)}/${Difficulty[difficulty]}/${Act[act]}.json`;
  }

  static get(difficulty: Difficulty, seed: number, act: number): Promise<LevelData> {
    const mapId = [difficulty, toHex(seed, 8), act].join('__');
    let existing = this.maps.get(mapId);
    if (existing == null) {
      existing = this.fetch(difficulty, seed, act);
      this.maps.set(mapId, existing);
    }
    return existing;
  }

  static async fetch(difficulty: Difficulty, seed: number, act: number): Promise<LevelData> {
    const path = Diablo2MapTiles.url(difficulty, seed, act);
    const url = `${Diablo2MapTiles.MapHost}/${path}`;
    console.log('Fetching', { url });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${url} - ${res.status} - ${res.statusText}`);

    const json = await res.json();
    return new LevelData(json);
  }

  static getRaster(d: MapParams): Promise<unknown> {
    const tileId = ['raster', toHex(d.difficulty, 8), Act[d.act], d.seed, d.z, d.x, d.y, d.rasterFillColor].join('__');
    let existing = this.tiles.get(tileId);
    if (existing == null) {
      existing = this.tileRaster(d);
      this.tiles.set(tileId, existing);
    }
    return existing;
  }

  static async tileRaster(d: MapParams): Promise<ArrayBuffer | void> {
    const map = await this.get(d.difficulty, d.seed, d.act);
    // const tileId = ['raster', toHex(d.difficulty, 8), Act[d.act], d.seed, d.z, d.x, d.y].join('__');
    // const startTime = Date.now();

    const bounds = LevelBounds.tileToSourceBounds(d.x, d.y, d.z);
    const zones = map.findMaps(d.act, bounds);

    if (zones.length === 0) return;

    const canvas = document.createElement('canvas') as HTMLCanvasElement;

    const scale = LevelBounds.getScale(d.z);

    canvas.width = LevelBounds.TileSize * 2;
    canvas.height = LevelBounds.TileSize * 2;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    // console.time('RenderLevel:' + tileId);
    for (const zone of zones) LevelRender.render(zone, ctx, bounds, (1 / scale) * 2, d);
    // console.timeEnd('RenderLevel:' + tileId);

    // TODO 99% of the time for rendering a map is this conversion into a PNG
    // When maplibre lets us we should just return a canvas object
    const blob: Blob | null = await new Promise((r) => canvas.toBlob((b) => r(b), 'image/png'));
    if (blob == null) return;
    const buf = blob.arrayBuffer();
    // console.log(tileId, { duration: Date.now() - startTime });
    return buf;
  }
}

export class LevelData {
  data: Diablo2Map;
  levels: Map<number, Diablo2Level> = new Map();
  constructor(data: Diablo2Map) {
    this.data = data;
    for (const level of this.data.levels) this.levels.set(level.id, level);
  }

  static isMapInBounds(mapInfo: Diablo2Level, bounds: Bounds): boolean {
    if (mapInfo.offset.x + mapInfo.size.width < bounds.x) return false;
    if (mapInfo.offset.y + mapInfo.size.height < bounds.y) return false;
    if (mapInfo.offset.x > bounds.x + bounds.width) return false;
    if (mapInfo.offset.y > bounds.y + bounds.height) return false;
    return true;
  }

  findMaps(act: Act, bounds: Bounds): Diablo2Level[] {
    const output: Diablo2Level[] = [];
    for (const map of this.levels.values()) {
      const mapAct = ActUtil.fromLevel(map.id);
      if (mapAct !== act) continue;
      if (!LevelData.isMapInBounds(map, bounds)) continue;
      output.push(map);
    }

    return output;
  }
}
