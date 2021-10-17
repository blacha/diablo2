export class VectorMap {
  static source = 'source-diablo2-vector';
  static ids = new Set<string>();
  static layerName(s: string): string {
    const name = `layer-diablo2-vector-${s}`;
    this.ids.add(name);
    return name;
  }

  static add(map: any): void {
    map.addLayer({
      id: this.layerName('waypoint'),
      source: this.source,
      type: 'circle',
      paint: {
        'circle-radius': 3,
        'circle-color': '#ff00ff',
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': 0.5,
      },
      filter: ['==', 'type', 'waypoint'],
    });
    map.addLayer({
      id: this.layerName('zone-name'),
      source: this.source,
      type: 'symbol',
      layout: {
        'icon-image': 'custom-marker',
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Bold'],
        'text-offset': [0, 0],
        'text-anchor': 'bottom-left',
      },
      filter: ['==', 'type', 'zone-name'],
    });

    map.addLayer({
      id: this.layerName('exit-name'),
      source: this.source,
      type: 'symbol',
      layout: {
        'icon-image': 'custom-marker',
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Bold'],
        'text-offset': [0, 0],
        'text-anchor': 'bottom-left',
      },
      filter: ['==', 'type', 'exit'],
    });

    map.addLayer({
      id: this.layerName('exit'),
      source: this.source,
      type: 'circle',
      paint: {
        'circle-radius': 3,
        'circle-color': '#ff0000',
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': 0.5,
      },
      filter: ['==', 'type', 'exit'],
    });

    map.addLayer({
      id: this.layerName('super-unique'),
      source: this.source,
      type: 'circle',
      paint: {
        'circle-radius': 3,
        'circle-color': '#9b4dca',
        'circle-stroke-color': 'rgba(0,0,0,0.87)',
        'circle-stroke-width': 1,
        'circle-opacity': 0.5,
      },
      filter: ['==', 'type', 'super-unique'],
    });
    map.addLayer({
      id: this.layerName('super-unique-name'),
      source: this.source,
      type: 'symbol',
      minzoom: 3,
      layout: {
        'icon-image': 'custom-marker',
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top',
      },
      filter: ['==', 'type', 'super-unique'],
    });

    map.addLayer({
      id: this.layerName('unknown'),
      source: this.source,
      minzoom: 3,
      type: 'circle',
      paint: {
        'circle-radius': 3,
        'circle-color': '#f3722c',
        'circle-stroke-color': '#f8961e',
        'circle-stroke-width': 1,
        'circle-opacity': 0.5,
      },
      filter: ['==', 'type', 'unknown'],
    });

    map.addLayer({
      id: this.layerName('unknown-name'),
      source: this.source,
      type: 'symbol',
      minzoom: 3,
      layout: {
        'text-padding': 2,
        'text-offset': [0, 0.6],
        'icon-image': 'custom-marker',
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Bold'],
        'text-anchor': 'top',
      },
      filter: ['==', 'type', 'unknown'],
    });
  }

  static remove(map: any): void {
    for (const id of this.ids) map.removeLayer(id);
  }
}
