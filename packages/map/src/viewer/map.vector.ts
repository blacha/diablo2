import { Act } from '@diablo2/data';
import { toFeatureCollection } from '@linzjs/geojson';
import type { Feature } from 'geojson';
import { Diablo2Map, Diablo2Object } from '../index.js';
import { AreaUtil } from './area.js';
import { AreaLevel } from './area.name.js';
import { MapBounds } from './bounds.js';
import { MapData } from './tile.js';

function pointToPolygon(x: number, y: number, width = 1, height = 1, xOffset = 0, yOffset = 0): GeoJSON.Polygon {
  const topLeft = MapBounds.sourceToLatLng(x + xOffset, y + yOffset);
  const bottomRight = MapBounds.sourceToLatLng(x + xOffset + width, y + yOffset + height);

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

// some doors do not align properly like door: 24 / 27 in the tamoe highlands or secret doors like door: 129
const DoorVertical = new Set([13, 15, 23, 64]);
const DoorHorizontal = new Set([14, 16, 24]);

function doorToFeature(obj: Diablo2Object, z: Diablo2Map): GeoJSON.Feature | null {
  if (DoorVertical.has(obj.id)) {
    return {
      type: 'Feature',
      geometry: pointToPolygon(z.offset.x + obj.x, z.offset.y + obj.y, 1, 5, 0, -2),
      properties: {
        type: 'door',
        name: obj.name,
        id: obj.id,
      },
    };
  }
  if (DoorHorizontal.has(obj.id)) {
    return {
      type: 'Feature',
      geometry: pointToPolygon(z.offset.x + obj.x, z.offset.y + obj.y, 5, 1, -2, 0),
      properties: { type: 'door', name: obj.name, id: obj.id },
    };
  }
  return null;
}

function waypointToFeature(obj: Diablo2Object, z: Diablo2Map): GeoJSON.Feature | null {
  if (obj.type !== 'object') return null;
  if (obj.name?.toLowerCase() !== 'waypoint') return null;

  return {
    type: 'Feature',
    geometry: pointToPolygon(z.offset.x + obj.x, z.offset.y + obj.y, 12, 12, -2, -2),
    properties: { type: 'waypoint', name: 'waypoint:' + obj.id },
  };
}

// Todo should really have a switch case for rendering to make this way faster
const Makers = [doorToFeature, waypointToFeature];
function makeFeature(obj: Diablo2Object, z: Diablo2Map): GeoJSON.Feature | null {
  for (const maker of Makers) {
    const feat = maker(obj, z);
    if (feat) return feat;
  }
  return null;
}

export function toGeoJson(c: MapData, act: Act): GeoJSON.FeatureCollection {
  const features: Feature[] = [];

  for (const z of c.zones.values()) {
    const mapAct = AreaUtil.getActLevel(z.id);
    if (mapAct !== act) continue;

    const latLng = MapBounds.sourceToLatLng(z.offset.x, z.offset.y);
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [latLng.lng, latLng.lat] },
      properties: { name: AreaLevel[z.id], type: 'zone-name' },
    });

    for (const obj of z.objects) {
      const feat = makeFeature(obj, z);
      if (feat != null) {
        features.push(feat);
        continue;
      }

      const latLng = MapBounds.sourceToLatLng(z.offset.x + obj.x, z.offset.y + obj.y);
      const geometry = { type: 'Point', coordinates: [latLng.lng, latLng.lat] } as GeoJSON.Point;

      if (obj.type === 'object' && obj.name?.toLowerCase() === 'waypoint') {
        features.push({ type: 'Feature', geometry, properties: { type: 'waypoint', name: obj.name, id: obj.id } });
        continue;
      }

      if (obj.type === 'npc' && obj.isSuperUnique && obj.name !== null) {
        features.push({
          type: 'Feature',
          geometry,
          properties: { type: 'super-unique', name: obj.name, id: obj.id },
        });
        continue;
      }

      if (obj.type === 'exit') {
        features.push({ type: 'Feature', geometry, properties: { type: 'exit', name: obj.name, id: obj.id } });
        continue;
      }

      features.push({
        type: 'Feature',
        geometry,
        properties: { ...obj, type: 'unknown', name: `${obj.name ?? ''} ${obj.id}`, id: obj.id },
      });
    }
  }
  return toFeatureCollection(features);
}
