import { Act, Difficulty } from '@diablo2/data';
import { AreaUtil } from './area.js';
import { MapTiles } from './tile.js';
import { toHex } from 'binparse/build/src/hex.js';

declare const maplibregl: any;

export type Cancel = { cancel: () => void };
const cancel = { cancel: (): void => undefined };
maplibregl.addProtocol('d2', (params: { url: string }, cb: (d?: unknown, e?: unknown) => void): Cancel | void => {
  const chunks = params.url.split('/');

  const seed = Number(chunks[2]);
  if (isNaN(seed)) return cb();

  const difficulty = AreaUtil.getDifficulty(chunks[3]);
  if (difficulty == null) return cb();

  const act = AreaUtil.getAct(chunks[4]);
  if (act == null) return cb();

  const z = Number(chunks[5]);
  const x = Number(chunks[6]);
  const y = Number(chunks[7]);
  if (isNaN(x) || isNaN(x) || isNaN(z)) return cb();

  console.log('Fetch', { chunks, seed, difficulty, z, x, y });

  MapTiles.render(difficulty, act, seed, z, x, y).then((d) => cb(null, d));
  return cancel;
});

export class D2MapViewer {
  map: any;

  difficulty = Difficulty.Nightmare;
  act = Act.ActV;
  seed = 0x00ff00ff;

  constructor(el: string) {
    this.map = new maplibregl.Map({
      container: el,
      zoom: 0,
      minZoom: 0,
      center: [180, 90],
      style: '',
      accessToken: '',
    });
    this.trackDom();
    this.updateFromUrl();
  }

  updateFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    this.seed = Number(urlParams.get('seed'));
    if (isNaN(this.seed)) this.seed = 0x00ff00ff;
    this.act = AreaUtil.getAct(urlParams.get('act')) ?? Act.ActI;
    this.difficulty = AreaUtil.getDifficulty(urlParams.get('difficulty')) ?? Difficulty.Normal;
  }

  updateUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('seed', toHex(this.seed, 8));
    urlParams.set('act', Act[this.act]);
    urlParams.set('difficulty', Difficulty[this.difficulty]);
    window.history.replaceState(null, '', '?' + urlParams.toString());
  }

  lastUrl: string | null;
  update(): void {
    this.updateUrl();
    this.updateDom();
    const d2Url = `d2://${toHex(this.seed, 8)}/${Difficulty[this.difficulty]}/${Act[this.act]}/{z}/{x}/{y}`;
    if (this.lastUrl === d2Url) return;
    this.lastUrl = d2Url;

    if (this.map.style && this.map.style.sourceCaches['diablo2-collision']) {
      this.map.removeLayer('diablo2-collision');
      this.map.removeSource('diablo2-collision');
    }
    this.map.addSource('diablo2-collision', { type: 'raster', tiles: [d2Url], maxzoom: 14 });
    this.map.addLayer({ id: 'diablo2-collision', type: 'raster', source: 'diablo2-collision' });
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
