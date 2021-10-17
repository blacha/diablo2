import { Act, ActUtil, DifficultyUtil, toHex } from '@diablo2/data';
import { toGeoJson } from './map.vector.js';
import { MapParams, Diablo2MapTiles } from './tile.js';
declare const maplibregl: any;

function urlToParams(url: string): null | MapParams {
  const chunks = url.split('/');

  const seed = Number(chunks[2]);
  if (isNaN(seed)) return null;

  const difficulty = DifficultyUtil.fromString(chunks[3]);
  if (difficulty == null) return null;

  const act = ActUtil.fromString(chunks[4]);
  if (act == null) return null;
  return { seed, difficulty, act } as MapParams;
}

function urlToXyzParams(url: string): null | MapParams {
  const chunks = url.split('/');

  const seed = Number(chunks[2]);
  if (isNaN(seed)) return null;

  const difficulty = DifficultyUtil.fromString(chunks[3]);
  if (difficulty == null) return null;

  const act = ActUtil.fromString(chunks[4]);
  if (act == null) return null;

  const z = Number(chunks[5]);
  const x = Number(chunks[6]);
  const y = Number(chunks[7]);

  if (isNaN(x) || isNaN(x) || isNaN(z)) return null;

  return { seed, difficulty, act, x, y, z };
}

export type Cancel = { cancel: () => void };
const cancel = { cancel: (): void => undefined };
/** Vector layer, convert all the useful points into a geojson structure for rendering */
maplibregl.addProtocol('d2v', (params: { url: string }, cb: (e?: unknown, d?: unknown) => void): Cancel | void => {
  const data = urlToParams(params.url);
  if (data == null) return cb();

  Diablo2MapTiles.get(data.difficulty, data.seed, data.act).then((c) => {
    const vectorId = ['vector', toHex(data.difficulty, 8), Act[data.act], data.seed].join('__');
    console.time(vectorId);
    const vector = toGeoJson(c, data.act);
    console.timeEnd(vectorId);
    cb(null, vector);
  });
  return cancel;
});

/** Raster layer, Create a canvas collision layer */
maplibregl.addProtocol('d2r', (params: { url: string }, cb: (e?: unknown, d?: unknown) => void): Cancel | void => {
  const data = urlToXyzParams(params.url);
  if (data == null) return cb();
  Diablo2MapTiles.getRaster(data).then((d) => cb(null, d));
  return cancel;
});
