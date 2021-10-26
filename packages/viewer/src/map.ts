import { Act, ActUtil, Difficulty, DifficultyUtil } from '@diablo2/data';
import { toHex } from 'binparse/build/src/hex.js';
import { LevelBounds, MapLocation } from './bounds.js';
import { MapLayers } from './map.objects.js';
import { registerMapProtocols } from './map.protocol.js';
import { Diablo2GameState } from '@diablo2/state';
import { toFeatureCollection } from '@linzjs/geojson';

declare const maplibregl: any;

export class Diablo2MapViewer {
  map: any;

  color = 'white';
  updateUrlTimer: unknown;
  ctx: Diablo2GameState;

  constructor(el: string) {
    this.ctx = new Diablo2GameState('');
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
   * Support parsing of zooms, pitches, bearings with `z14` or `14z`, etc
   * @param value string to parse value from
   * @param prefixSuffix prefix or suffix for the map property
   */
  parseMapControlValue(value: string | null, prefixSuffix: string): number {
    if (value == null || value === '') return NaN;
    if (value.startsWith(prefixSuffix)) return parseFloat(value.slice(1));
    if (value.endsWith(prefixSuffix)) return parseFloat(value);
    return NaN;
  }

  /** Parse a location from window.hash if it exists */
  fromHash(str: string): Partial<MapLocation> {
    const output: Partial<MapLocation> = {};
    const hash = str.replace('#@', '');
    const [latS, lonS, zoomS, pitchS, bearingS] = hash.split(',');
    const lat = parseFloat(latS);
    const lon = parseFloat(lonS);
    if (!isNaN(lat) && !isNaN(lon)) {
      output.lat = lat;
      output.lon = lon;
    }

    const newZoom = this.parseMapControlValue(zoomS, 'z');
    if (!isNaN(newZoom)) {
      output.zoom = newZoom;
    }

    const newPitch = this.parseMapControlValue(pitchS, 'p');
    if (!isNaN(newPitch)) {
      output.pitch = newPitch;
    }

    const newBearing = this.parseMapControlValue(bearingS, 'b');
    if (!isNaN(newBearing)) {
      output.bearing = newBearing;
    }

    return output;
  }

  updateFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const state = this.ctx.state;
    state.map.id = Number(urlParams.get('seed'));
    if (isNaN(state.map.id) || state.map.id <= 0) state.map.id = 0x00ff00ff;
    state.map.act = ActUtil.fromString(urlParams.get('act')) ?? Act.ActI;
    state.map.difficulty = DifficultyUtil.fromString(urlParams.get('difficulty')) ?? Difficulty.Normal;
    this.color = urlParams.get('color') || 'white';

    if (window.location.hash == null) return;

    const location = this.fromHash(window.location.hash);
    if (location.zoom) this.map.setZoom(location.zoom);
    if (location.pitch) this.map.setPitch(location.pitch);
    if (location.bearing) this.map.setBearing(location.bearing);
    if (location.lat) this.map.setCenter(location);
  }

  updateUrl(): void {
    const state = this.ctx.state;

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('seed', toHex(state.map.id, 8));
    urlParams.set('act', Act[state.map.act]);
    urlParams.set('difficulty', Difficulty[state.map.difficulty]);
    urlParams.set('color', this.color);
    const center = this.map.getCenter();
    if (center == null) throw new Error('Invalid Map location');
    const zoom = Math.floor((this.map.getZoom() ?? 0) * 10e3) / 10e3;
    const pitch = Math.floor((this.map.getPitch() ?? 0) * 10e3) / 10e3;
    const bearing = Math.floor((this.map.getBearing() ?? 0) * 10e3) / 10e3;

    window.history.replaceState(
      null,
      '',
      '?' + urlParams.toString() + `#@${center.lat.toFixed(7)},${center.lng.toFixed(7)},z${zoom},p${pitch},b${bearing}`,
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

    const state = this.ctx.state;
    const map = state.map;

    // State Update
    if (state.player.x > 0) {
      const { lng, lat } = LevelBounds.sourceToLatLng(state.player.x, state.player.y);
      this.map.setCenter([lng, lat]);
      this.map.setZoom(7); // TODO configure?
      const geojson: GeoJSON.Feature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: state.player,
      };

      const playerSource = this.map.getSource('game-state');
      if (playerSource == null) this.map.addSource('player', { type: 'geojson', data: toFeatureCollection([geojson]) });
      else playerSource.setData(toFeatureCollection([geojson]));
    }

    const d2Url = `${toHex(map.id, 8)}/${Difficulty[map.difficulty]}/${Act[map.act]}/{z}/{x}/{y}/${this.color}`;

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

    if (this.map.getSource('game-state') == null) {
      this.map.addSource('game-state', { type: 'geojson', data: toFeatureCollection([]) });
    }
    this.map.addLayer({ id: 'layer-diablo2-collision', type: 'raster', source: 'source-diablo2-collision' });

    for (const [layerId, layer] of MapLayers) {
      layer.source = layer.source ?? 'source-diablo2-vector';
      layer.id = layerId;
      layer.name = layerId;
      this.map.addLayer(layer);
    }
  }

  setAct(a: string): void {
    const act = ActUtil.fromString(a);
    if (act == null || this.ctx.state.map.act === act) return;
    this.ctx.state.map.act = act;
    this.update();
  }

  setDifficulty(a: string): void {
    const difficulty = DifficultyUtil.fromString(a);
    if (difficulty == null || this.ctx.state.map.difficulty === difficulty) return;
    this.ctx.state.map.difficulty = difficulty;
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
    const state = this.ctx.state;
    const acts = document.querySelectorAll('button.options__act') as NodeListOf<HTMLButtonElement>;
    acts.forEach((f: HTMLButtonElement) => {
      if (ActUtil.fromString(f.value) === state.map.act) {
        f.classList.add('button-outline');
        f.classList.remove('button-clear');
      } else {
        f.classList.remove('button-outline');
        f.classList.add('button-clear');
      }
    });

    const seed = document.querySelector('.options__seed') as HTMLDivElement;
    if (seed) seed.innerText = toHex(state.map.id, 8);

    const difficulties = document.querySelectorAll('button.options__difficulty') as NodeListOf<HTMLButtonElement>;
    difficulties.forEach((f: HTMLButtonElement) => {
      if (DifficultyUtil.fromString(f.value) === state.map.difficulty) {
        f.classList.add('button-outline');
        f.classList.remove('button-clear');
      } else {
        f.classList.remove('button-outline');
        f.classList.add('button-clear');
      }
    });
  }
}
