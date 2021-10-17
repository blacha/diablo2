import { Diablo2LevelObject } from '@diablo2/data';
import { FeatureMaker, MapObjectFilter } from './map.features.js';

export const MapObjects = new Map<number, FeatureMaker>();
export const MapExits = new Map<number, FeatureMaker>();

export const MapFeatureFilter: MapObjectFilter[] = [];

/** Configure how map objects are converted into geojson for rendering */

// Vertical doors
MapObjects.set(0x0d, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });
MapObjects.set(0x0f, { feature: 'polygon', width: 1, height: 5, yOffset: -2, layer: 'door' });
MapObjects.set(0x17, { feature: 'polygon', width: 2, height: 7, yOffset: -3, layer: 'door' });

// MapFeatures.set(64, { feature: 'polygon', width: 1, height: 4, yOffset: -2, layer: 'door' });

// Horizontal door
MapObjects.set(0x0e, { feature: 'polygon', width: 5, height: 1, xOffset: -2, layer: 'door' });
MapObjects.set(0x10, { feature: 'polygon', width: 5, height: 1, xOffset: -2, layer: 'door' });
MapObjects.set(0x18, { feature: 'polygon', width: 6, height: 2, xOffset: -3, yOffset: -2, layer: 'door' });
MapObjects.set(0x19, { feature: 'polygon', width: 6, height: 2, xOffset: -3, layer: 'door' });

MapObjects.set(0x1b, { feature: 'polygon', width: 9, height: 2, xOffset: -3, yOffset: 2, layer: 'door' });

// Waypoints
MapObjects.set(119, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(145, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(156, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(157, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(237, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(238, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(288, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(323, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(324, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(398, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(402, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(429, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(494, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(496, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(511, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });
MapObjects.set(539, { feature: 'polygon', width: 12, height: 12, xOffset: -2, yOffset: -2, layer: 'waypoint' });

// General exits make a square
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
const TextSymbol = {
  'icon-image': 'custom-marker',
  'text-field': ['get', 'name'],
  'text-font': ['Open Sans Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top',
};

export interface StyleJsonObject extends Record<string, unknown> {
  id: string;
  type: 'symbol' | 'fill' | 'circle';
}

export const MapLayers: StyleJsonObject[] = [];
/** Level text eg "Blood Moor" */
MapLayers.push({ id: 'level-name', type: 'symbol', layout: TextSymbol, filter: ['==', 'type', 'level-name'] });

/** Show waypoints as the polygon and the text */
MapLayers.push({
  id: 'waypoint',
  type: 'fill',
  paint: { 'fill-color': '#06d6a0', 'fill-opacity': 0.87 },
  filter: ['==', 'type', 'waypoint'],
});
MapLayers.push({ id: 'waypoint-name', type: 'symbol', layout: TextSymbol, filter: ['==', 'type', 'waypoint'] });

/** Show exits as a block and as names */
MapLayers.push({
  id: 'exit',
  type: 'fill',
  paint: { 'fill-color': '#ef476f', 'fill-opacity': 0.87 },
  filter: ['==', 'type', 'exit'],
});
MapLayers.push({ id: 'exit-name', type: 'symbol', layout: TextSymbol, filter: ['==', 'type', 'exit'] });

/** Show doors as a light orange blocks */
MapLayers.push({
  id: 'door',
  type: 'fill',
  paint: { 'fill-color': '#f77f00', 'fill-opacity': 0.87 },
  filter: ['==', 'type', 'door'],
});

/** Show exits as a super uniques a cirlce and name */
MapLayers.push({
  id: 'super-unique',
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
MapLayers.push({ id: 'super-unique-name', type: 'symbol', layout: TextSymbol, filter: ['==', 'type', 'super-unique'] });

/** Show exits as a unknowns as a and name */
MapLayers.push({
  id: 'unknown',
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
MapLayers.push({
  id: 'unknown-name',
  minzoom: 6,
  type: 'symbol',
  layout: TextSymbol,
  filter: ['==', 'type', 'unknown'],
});
