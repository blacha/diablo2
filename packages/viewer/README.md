# @diablo2/viewer


Maplibre based web viewer for `@diablo2/map` 

![Map Preview](./static/2021-10-18-map-render.png)


## Usage

```javascript
import {Diablo2MapViewer} from '@diablo2/viewer';

document.addEventListener('DOMContentLoaded', () => new Diablo2MapViewer('map-el'));
```

## Style

Mapstyling is configured in two parts inside `src/map.objects.ts` or imported and modified

```typescript
import {MapObjects} from '@diablo2/viewer'
// Delete the rendering for object 0x0e (A Door)
MapObjects.delete(0x0e);

// Configure object 0x1b to be shown on the door layer
MapObjects.set(0x1b, { feature: 'point', layer: 'door' })

// Delete all doors from the map
MapLayers.delete('door')

// Do not show the names of super unique monsters
MapLayers.delete('super-unique-name')
```

#### MapLayers

How the maplibre renderer renders the map, this uses StyleJSON to configure what is actually shown on the map, for example 
- Should a object be shown with a point or text or both, 
- What color is the point on the map

```typescript
// Show a door as a orange block
MapLayers.set('door', {
  type: 'fill',
  paint: { 'fill-color': '#f77f00', 'fill-opacity': 0.87 },
  filter: ['==', 'type', 'door'],
});
```

#### MapObjects & MapFeatureFilter

Configures how the objects are created to be rendered, should it be rendered as a point or a polygon, how big of a polygon etc...


Create a polygon that is 5x1 units in size, then offset it -2 units in the x direction from where its object's x is located

```typescript
MapObjects.set(0x0e, { feature: 'polygon', width: 5, height: 1, xOffset: -2, layer: 'door' });
```

`MapFeatureFilter` enables custom functions to be run to render objects

For example, create a point for NPCs only if they are super unique and have a valid name

```typescript
function superUniquePoint(f: Diablo2LevelObject): FeatureMaker | void {
  if (f.type !== 'npc') return;
  if (f.isSuperUnique !== true) return;
  if (f.name == null) return;
  return { feature: 'point', layer: 'super-unique' };
}
```