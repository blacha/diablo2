import { Diablo2LevelObject } from '@diablo2/data';
import { FeatureMaker, MapObjectFilter } from './map.features.js';

export const MapObjects = new Map<number, FeatureMaker>();
// export const MapExits = new Map<number, FeatureMaker>();

export const MapFeatureFilter: MapObjectFilter[] = [];

/** Configure how map objects are converted into geojson for rendering */

// Vertical doors
MapObjects.set(0x0d, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });
MapObjects.set(0x0f, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });
MapObjects.set(0x40, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });
MapObjects.set(0x17, { feature: 'polygon', width: 2, height: 7, yOffset: -3, layer: 'door' });
MapObjects.set(0x5b, { feature: 'polygon', width: 1, height: 5, layer: 'door' });
MapObjects.set(0x81, { feature: 'polygon', width: 1, height: 6, yOffset: -3, xOffset: -1, layer: 'door' });
MapObjects.set(0x122, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });
MapObjects.set(0x124, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });
MapObjects.set(0x126, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });

// MapFeatures.set(64, { feature: 'polygon', width: 1, height: 4, yOffset: -2, layer: 'door' });

// Horizontal door
MapObjects.set(0x0e, { feature: 'polygon', width: 5, height: 1, xOffset: -2, layer: 'door' });
MapObjects.set(0x10, { feature: 'polygon', width: 5, height: 1, xOffset: -2, layer: 'door' });
MapObjects.set(0x18, { feature: 'polygon', width: 6, height: 2, xOffset: -3, yOffset: -2, layer: 'door' });
MapObjects.set(0x19, { feature: 'polygon', width: 6, height: 2, xOffset: -3, layer: 'door' });
MapObjects.set(0x2f, { feature: 'polygon', width: 8, height: 2, xOffset: -3, layer: 'door' });

MapObjects.set(0x5c, { feature: 'polygon', width: 5, height: 1, layer: 'door' });
MapObjects.set(0x123, { feature: 'polygon', width: 5, height: 1, xOffset: -2, layer: 'door' });
MapObjects.set(0x125, { feature: 'polygon', width: 5, height: 1, xOffset: -2, layer: 'door' });
MapObjects.set(0x127, { feature: 'polygon', width: 5, height: 1, xOffset: -3, layer: 'door' });

MapObjects.set(0x1b, { feature: 'polygon', width: 9, height: 2, xOffset: -3, yOffset: 2, layer: 'door' });

// Waypoints
function generalWaypoint(f: Diablo2LevelObject): FeatureMaker | void {
  if (f.type !== 'object') return;
  if (!f.name?.toLowerCase().includes('waypoint')) return;
  return { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' };
}
MapFeatureFilter.push(generalWaypoint);

// Exits make a square
function generalExit(f: Diablo2LevelObject): FeatureMaker | void {
  if (f.type !== 'exit') return;
  return { feature: 'polygon', width: 9, height: 9, xOffset: -4, yOffset: -4, layer: 'exit' };
}
MapFeatureFilter.push(generalExit);

/** Create a name and point for super unique monsters */
function superUniquePoint(f: Diablo2LevelObject): FeatureMaker | void {
  if (f.type !== 'npc') return;
  if (f.isSuperUnique !== true) return;
  if (f.name == null) return;
  return { feature: 'point', layer: 'super-unique' };
}

MapFeatureFilter.push(superUniquePoint);

function unknownPoint(): FeatureMaker | void {
  return { feature: 'point', layer: 'unknown' };
}
MapFeatureFilter.push(unknownPoint);

/** Configure how map libre renders the geojson */
const TextSymbolLayout = {
  'icon-image': 'custom-marker',
  'text-field': ['get', 'name'],
  'text-font': ['Open Sans Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top',
};
const TextSymbolPaint = {
  'text-halo-color': '#ffffff',
  'text-halo-width': 2,
};

export interface StyleJsonObject extends Record<string, unknown> {
  type: 'symbol' | 'fill' | 'circle';
}

export const MapLayers: Map<string, StyleJsonObject> = new Map();
/** Level text eg "Blood Moor" */
MapLayers.set('level-name', {
  type: 'symbol',
  layout: TextSymbolLayout,
  paint: TextSymbolPaint,
  filter: ['==', 'type', 'level-name'],
});

/** Show waypoints as the polygon and the text */
MapLayers.set('waypoint', {
  type: 'fill',
  paint: { 'fill-color': '#06d6a0', 'fill-opacity': 0.87 },
  filter: ['==', 'type', 'waypoint'],
});
MapLayers.set('waypoint-name', {
  id: 'waypoint-name',
  type: 'symbol',
  layout: TextSymbolLayout,
  paint: TextSymbolPaint,
  filter: ['==', 'type', 'waypoint'],
});

/** Show exits as a block and as names */
MapLayers.set('exit', {
  type: 'fill',
  paint: { 'fill-color': '#ef476f', 'fill-opacity': 0.87 },
  filter: ['==', 'type', 'exit'],
});
MapLayers.set('exit-name', {
  type: 'symbol',
  layout: TextSymbolLayout,
  paint: TextSymbolPaint,
  filter: ['==', 'type', 'exit'],
});

MapLayers.set('exit-good', {
  type: 'fill',
  paint: { 'fill-color': '#0000ac', 'fill-opacity': 0.87 },
  filter: ['==', 'isGoodExit', true],
});

/** Show doors as a light orange blocks */
MapLayers.set('door', {
  type: 'fill',
  paint: { 'fill-color': '#f77f00', 'fill-opacity': 0.87 },
  filter: ['==', 'type', 'door'],
});

/** Show exits as a super uniques a cirlce and name */
MapLayers.set('super-unique', {
  type: 'circle',
  paint: {
    'circle-radius': 3,
    'circle-color': '#9b4dca',
    'circle-stroke-color': '#023047',
    'circle-stroke-width': 1,
    'circle-opacity': 0.5,
  },
  filter: ['==', 'type', 'super-unique'],
});
MapLayers.set('super-unique-name', {
  type: 'symbol',
  layout: TextSymbolLayout,
  paint: TextSymbolPaint,
  filter: ['==', 'type', 'super-unique'],
});

/** Show exits as a unknowns as a and name */
MapLayers.set('unknown', {
  type: 'circle',
  minzoom: 6,
  paint: {
    'circle-radius': 3,
    'circle-color': '#ffc6ff',
    'circle-stroke-color': '#023047',
    'circle-stroke-width': 1,
    'circle-opacity': 0.5,
  },
  filter: ['==', 'type', 'unknown'],
});
MapLayers.set('door-name', {
  minzoom: 6,
  type: 'symbol',
  layout: TextSymbolLayout,
  paint: TextSymbolPaint,
  filter: ['==', 'type', 'door'],
});

MapLayers.set('unknown-name', {
  minzoom: 6,
  type: 'symbol',
  layout: TextSymbolLayout,
  paint: TextSymbolPaint,
  filter: ['==', 'type', 'unknown'],
});

MapLayers.set('player', {
  source: 'game-state',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#ff00ff',
    'circle-stroke-color': '#023047',
    'circle-stroke-width': 1,
    'circle-opacity': 0.87,
  },
  filter: ['==', 'type', 'player'],
});
