import { Act, Difficulty } from '@diablo2/data';
import { toFeatureCollection } from '@linzjs/geojson';
import { toHex } from 'binparse/build/src/hex.js';
import type { Feature } from 'geojson';
import { AreaUtil } from './area.js';
import { AreaLevel } from './area.name.js';
import { MapBounds } from './bounds.js';
import { VectorMap } from './map.style.js';
import { MapParams, MapTiles } from './tile.js';

declare const maplibregl: any;

function urlToParams(url: string): null | MapParams {
  const chunks = url.split('/');

  const seed = Number(chunks[2]);
  if (isNaN(seed)) return null;

  const difficulty = AreaUtil.getDifficulty(chunks[3]);
  if (difficulty == null) return null;

  const act = AreaUtil.getAct(chunks[4]);
  if (act == null) return null;
  return { seed, difficulty, act } as MapParams;
}

function urlToXyzParams(url: string): null | MapParams {
  const chunks = url.split('/');

  const seed = Number(chunks[2]);
  if (isNaN(seed)) return null;

  const difficulty = AreaUtil.getDifficulty(chunks[3]);
  if (difficulty == null) return null;

  const act = AreaUtil.getAct(chunks[4]);
  if (act == null) return null;

  const z = Number(chunks[5]);
  const x = Number(chunks[6]);
  const y = Number(chunks[7]);
  // console.log({ z, x, y });

  if (isNaN(x) || isNaN(x) || isNaN(z)) return null;

  return { seed, difficulty, act, x, y, z };
}

export type Cancel = { cancel: () => void };
const cancel = { cancel: (): void => undefined };
maplibregl.addProtocol('d2v', (params: { url: string }, cb: (e?: unknown, d?: unknown) => void): Cancel | void => {
  const data = urlToParams(params.url);
  if (data == null) return cb();
  MapTiles.get(data.difficulty, data.seed, data.act).then((c) => {
    const features: Feature[] = [];

    for (const z of c.zones.values()) {
      const mapAct = AreaUtil.getActLevel(z.id);
      if (mapAct !== data.act) continue;

      const latLng = MapBounds.sourceToLatLng(z.offset.x, z.offset.y);
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [latLng.lng, latLng.lat] },
        properties: { name: AreaLevel[z.id], type: 'zone-name' },
      });

      for (const obj of z.objects) {
        const latLng = MapBounds.sourceToLatLng(z.offset.x + obj.x, z.offset.y + obj.y);
        const geometry = { type: 'Point', coordinates: [latLng.lng, latLng.lat] } as GeoJSON.Point;

        if (obj.type === 'object' && obj.name?.toLowerCase() === 'waypoint') {
          features.push({ type: 'Feature', geometry, properties: { type: 'waypoint' } });
          continue;
        }

        if (obj.type === 'npc' && obj.isSuperUnique && obj.name !== null) {
          features.push({ type: 'Feature', geometry, properties: { type: 'super-unique', name: obj.name } });
          continue;
        }

        if (obj.type === 'exit') {
          features.push({ type: 'Feature', geometry, properties: { type: 'exit', name: obj.name } });
          continue;
        }

        features.push({
          type: 'Feature',
          geometry,
          properties: { ...obj, type: 'unknown', name: `${obj.name ?? ''} ${obj.id}` },
        });
      }
    }

    return cb(null, toFeatureCollection(features));
  });

  return cancel;
});
maplibregl.addProtocol('d2r', (params: { url: string }, cb: (e?: unknown, d?: unknown) => void): Cancel | void => {
  const data = urlToXyzParams(params.url);
  if (data == null) return cb();

  MapTiles.getRaster(data).then((d) => cb(null, d));
  return cancel;
});

export interface LonLat {
  lat: number;
  lon: number;
}

export interface MapLocation extends LonLat {
  zoom: number;
}

export class D2MapViewer {
  map: any;

  difficulty = Difficulty.Nightmare;
  act = Act.ActV;
  seed = 0x00ff00ff;
  updateUrlTimer: unknown;

  constructor(el: string) {
    this.map = new maplibregl.Map({
      container: el,
      zoom: 0,
      minZoom: 0,
      center: [180, 90],
      style: {
        version: 8,
        id: 'base-style',
        sources: {},
        layers: [],
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
        sprite: 'https://nst-guide.github.io/osm-liberty-topo/sprites/osm-liberty-topo',
      },
      accessToken: '',
    });

    (window as any).map = this.map;

    this.map.on('load', () => {
      this.trackDom();
      this.updateFromUrl();
      this.update();
      this.map.on('render', this.render);
    });
  }
  /**
   * Support parsing of zooms with `z14` or `14z`
   * @param zoom string to parse zoom from
   */
  parseZoom(zoom: string | null): number {
    if (zoom == null || zoom === '') return NaN;
    if (zoom.startsWith('z')) return parseFloat(zoom.slice(1));
    if (zoom.endsWith('z')) return parseFloat(zoom);
    return NaN;
  }

  /** Parse a location from window.hash if it exists */
  fromHash(str: string): Partial<MapLocation> {
    const output: Partial<MapLocation> = {};
    const hash = str.replace('#@', '');
    const [latS, lonS, zoomS] = hash.split(',');
    const lat = parseFloat(latS);
    const lon = parseFloat(lonS);
    if (!isNaN(lat) && !isNaN(lon)) {
      output.lat = lat;
      output.lon = lon;
    }

    const newZoom = this.parseZoom(zoomS);
    if (!isNaN(newZoom)) {
      output.zoom = newZoom;
    }

    return output;
  }

  updateFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    this.seed = Number(urlParams.get('seed'));
    if (isNaN(this.seed) || this.seed <= 0) this.seed = 0x00ff00ff;
    this.act = AreaUtil.getAct(urlParams.get('act')) ?? Act.ActI;
    this.difficulty = AreaUtil.getDifficulty(urlParams.get('difficulty')) ?? Difficulty.Normal;

    if (window.location.hash == null) return;

    const location = this.fromHash(window.location.hash);
    if (location.zoom) this.map.setZoom(location.zoom);
    if (location.lat) this.map.setCenter(location);
  }

  updateUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('seed', toHex(this.seed, 8));
    urlParams.set('act', Act[this.act]);
    urlParams.set('difficulty', Difficulty[this.difficulty]);
    const center = this.map.getCenter();
    if (center == null) throw new Error('Invalid Map location');
    const zoom = Math.floor((this.map.getZoom() ?? 0) * 10e3) / 10e3;
    window.history.replaceState(
      null,
      '',
      '?' + urlParams.toString() + `#@${center.lat.toFixed(7)},${center.lng.toFixed(7)},z${zoom}`,
    );
    this.updateUrlTimer = null;
  }

  render = (): void => {
    if (this.updateUrlTimer != null) return;
    this.updateUrlTimer = setTimeout(() => this.updateUrl(), 1000);
  };

  lastUrl: string | null;
  update(): void {
    this.updateUrl();
    this.updateDom();
    const d2Url = `${toHex(this.seed, 8)}/${Difficulty[this.difficulty]}/${Act[this.act]}/{z}/{x}/{y}`;
    if (this.lastUrl === d2Url) return;
    this.lastUrl = d2Url;

    if (this.map.style && this.map.style.sourceCaches['source-diablo2-collision']) {
      this.map.removeLayer('layer-diablo2-collision');
      this.map.removeSource('source-diablo2-collision');

      VectorMap.remove(this.map);
      this.map.removeSource('source-diablo2-vector');
    }
    this.map.addSource('source-diablo2-collision', { type: 'raster', tiles: [`d2r://${d2Url}`], maxzoom: 14 });
    this.map.addSource('source-diablo2-vector', { type: 'geojson', data: `d2v://${d2Url}` });

    this.map.addLayer({ id: 'layer-diablo2-collision', type: 'raster', source: 'source-diablo2-collision' });

    VectorMap.add(this.map);
  }

  setAct(a: string): void {
    const act = AreaUtil.getAct(a);
    if (act == null || this.act === act) return;
    this.act = act;
    this.update();
  }

  setDifficulty(a: string): void {
    const difficulty = AreaUtil.getDifficulty(a);
    if (difficulty == null || this.difficulty === difficulty) return;
    this.difficulty = difficulty;
    this.update();
  }

  trackDom(): void {
    document
      .querySelectorAll<HTMLButtonElement>('button.options__act')
      .forEach((f) => f.addEventListener('click', (): void => this.setAct(f.value)));

    document
      .querySelectorAll<HTMLButtonElement>('button.options__difficulty')
      .forEach((f) => f.addEventListener('click', (): void => this.setDifficulty(f.value)));
  }

  updateDom(): void {
    const acts = document.querySelectorAll('button.options__act') as NodeListOf<HTMLButtonElement>;
    acts.forEach((f: HTMLButtonElement) => {
      if (AreaUtil.getAct(f.value) === this.act) {
        f.classList.add('button-outline');
        f.classList.remove('button-clear');
      } else {
        f.classList.remove('button-outline');
        f.classList.add('button-clear');
      }
    });

    const seed = document.querySelector('.options__seed') as HTMLDivElement;
    if (seed) seed.innerText = toHex(this.seed, 8);

    const difficulties = document.querySelectorAll('button.options__difficulty') as NodeListOf<HTMLButtonElement>;
    difficulties.forEach((f: HTMLButtonElement) => {
      if (AreaUtil.getDifficulty(f.value) === this.difficulty) {
        f.classList.add('button-outline');
        f.classList.remove('button-clear');
      } else {
        f.classList.remove('button-outline');
        f.classList.add('button-clear');
      }
    });
  }
}
