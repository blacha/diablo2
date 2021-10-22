import { Act, ActUtil, Diablo2Level, Diablo2LevelObject, toHex } from '@diablo2/data';
import { toFeatureCollection } from '@linzjs/geojson';
import type { Feature } from 'geojson';
import { LevelBounds } from './bounds.js';
import { FeatureMaker } from './map.features.js';
import { MapFeatureFilter, MapObjects } from './map.objects.js';
import { LevelData } from './tile.js';

function pointToPolygon(x: number, y: number, width = 1, height = 1, xOffset = 0, yOffset = 0): GeoJSON.Polygon {
  const topLeft = LevelBounds.sourceToLatLng(x + xOffset, y + yOffset);
  const bottomRight = LevelBounds.sourceToLatLng(x + xOffset + width, y + yOffset + height);

  return {
    type: 'Polygon',
    coordinates: [
      [
        [topLeft.lng, topLeft.lat],
        [bottomRight.lng, topLeft.lat],
        [bottomRight.lng, bottomRight.lat],
        [topLeft.lng, bottomRight.lat],
        [topLeft.lng, topLeft.lat],
      ],
    ],
  };
}

function toFeature(obj: Diablo2LevelObject, z: Diablo2Level, fm: FeatureMaker): GeoJSON.Feature {
  if (fm.feature === 'polygon') {
    return {
      type: 'Feature',
      geometry: pointToPolygon(z.offset.x + obj.x, z.offset.y + obj.y, fm.width, fm.height, fm.xOffset, fm.yOffset),
      properties: { ...obj, type: fm.layer, name: `${toHex(obj.id)} ${obj.name ?? ''}` },
    };
  }

  if (fm.feature === 'point') {
    const latLng = LevelBounds.sourceToLatLng(z.offset.x + obj.x, z.offset.y + obj.y);
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [latLng.lng, latLng.lat] },
      properties: { ...obj, type: fm.layer, name: `${toHex(obj.id)} ${obj.name ?? ''}` },
    };
  }

  throw new Error('Unknown feature type: ' + fm);
}

function makeFeature(obj: Diablo2LevelObject, z: Diablo2Level): GeoJSON.Feature | null | false {
  if (obj.type === 'object') {
    const fm = MapObjects.get(obj.id);
    if (fm) return toFeature(obj, z, fm);
  }

  for (const filter of MapFeatureFilter) {
    const fm = filter(obj);
    if (fm === false) return null;
    if (fm) return toFeature(obj, z, fm);
  }

  return null;
}

export function toGeoJson(c: LevelData, act: Act): GeoJSON.FeatureCollection {
  const features: Feature[] = [];

  for (const z of c.levels.values()) {
    const mapAct = ActUtil.fromLevel(z.id);
    if (mapAct !== act) continue;

    const latLng = LevelBounds.sourceToLatLng(z.offset.x, z.offset.y);
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [latLng.lng, latLng.lat] },
      properties: { name: z.name, type: 'level-name' },
    });

    for (const obj of z.objects) {
      const feat = makeFeature(obj, z);
      if (feat == null || feat === false) continue;
      features.push(feat);
    }
  }
  return toFeatureCollection(features);
}
