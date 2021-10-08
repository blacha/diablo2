import o from 'ospec';
import { MapBounds, WebMercatorBounds } from '../bounds.js';

o.spec('Bounds', () => {
  const halfMap = MapBounds.Size / 2;

  o('should map to web mercator projection ', () => {
    const center = MapBounds.sourceToWebMercator(halfMap, halfMap);
    o(center).deepEquals({ x: 0, y: 0 });

    const topLeft = MapBounds.sourceToWebMercator(0, 0);
    o(topLeft).deepEquals({ x: -WebMercatorBounds, y: WebMercatorBounds });

    const topRight = MapBounds.sourceToWebMercator(MapBounds.Size, 0);
    o(topRight).deepEquals({ x: WebMercatorBounds, y: WebMercatorBounds });

    const bottomRight = MapBounds.sourceToWebMercator(MapBounds.Size, MapBounds.Size);
    o(bottomRight).deepEquals({ x: WebMercatorBounds, y: -WebMercatorBounds });

    const bottomLeft = MapBounds.sourceToWebMercator(0, MapBounds.Size);
    o(bottomLeft).deepEquals({ x: -WebMercatorBounds, y: -WebMercatorBounds });
  });

  o('should convert to latLng', () => {
    const center = MapBounds.sourceToLatLng(halfMap, halfMap);
    o(center).deepEquals({ lat: 0, lng: 0 });

    const topLeft = MapBounds.sourceToLatLng(0, 0);
    o(topLeft.lng.toFixed(2)).equals('-180.00');
    o(topLeft.lat.toFixed(2)).equals('85.05');

    const topRight = MapBounds.sourceToLatLng(MapBounds.Size, 0);
    o(topRight.lng.toFixed(2)).equals('180.00');
    o(topRight.lat.toFixed(2)).equals('85.05');

    const bottomRight = MapBounds.sourceToLatLng(MapBounds.Size, MapBounds.Size);
    o(bottomRight.lng.toFixed(2)).equals('180.00');
    o(bottomRight.lat.toFixed(2)).equals('-85.05');

    const bottomLeft = MapBounds.sourceToLatLng(0, MapBounds.Size);
    o(bottomLeft.lng.toFixed(2)).equals('-180.00');
    o(bottomLeft.lat.toFixed(2)).equals('-85.05');
  });
});
