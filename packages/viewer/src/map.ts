import { Act, ActUtil, Difficulty, DifficultyUtil } from '@diablo2/data';
import { toHex } from 'binparse/build/src/hex.js';
import { MapLocation } from './bounds.js';
import { MapLayers } from './map.objects.js';
import { registerMapProtocols } from './map.protocol.js';

declare const maplibregl: any;

export class Diablo2MapViewer {
  map: any;

  difficulty = Difficulty.Nightmare;
  act = Act.ActV;
  seed = 0x00ff00ff;
  updateUrlTimer: unknown;

  constructor(el: string) {
    registerMapProtocols(maplibregl);

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
    this.act = ActUtil.fromString(urlParams.get('act')) ?? Act.ActI;
    this.difficulty = DifficultyUtil.fromString(urlParams.get('difficulty')) ?? Difficulty.Normal;

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

      for (const layerId of MapLayers.keys()) this.map.removeLayer(layerId);
      this.map.removeSource('source-diablo2-vector');
    }
    this.map.addSource('source-diablo2-collision', { type: 'raster', tiles: [`d2r://${d2Url}`], maxzoom: 14 });
    this.map.addSource('source-diablo2-vector', { type: 'geojson', data: `d2v://${d2Url}` });

    this.map.addLayer({ id: 'layer-diablo2-collision', type: 'raster', source: 'source-diablo2-collision' });

    for (const [layerId, layer] of MapLayers) {
      layer.source = 'source-diablo2-vector';
      layer.id = layerId;
      this.map.addLayer(layer);
    }
  }

  setAct(a: string): void {
    const act = ActUtil.fromString(a);
    if (act == null || this.act === act) return;
    this.act = act;
    this.update();
  }

  setDifficulty(a: string): void {
    const difficulty = DifficultyUtil.fromString(a);
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
      if (ActUtil.fromString(f.value) === this.act) {
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
      if (DifficultyUtil.fromString(f.value) === this.difficulty) {
        f.classList.add('button-outline');
        f.classList.remove('button-clear');
      } else {
        f.classList.remove('button-outline');
        f.classList.add('button-clear');
      }
    });
  }
}
