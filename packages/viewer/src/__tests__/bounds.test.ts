import o from 'ospec';
import { LevelBounds, WebMercatorBounds } from '../bounds.js';

o.spec('Bounds', () => {
  const halfMap = LevelBounds.Size / 2;

  o('should map to web mercator projection ', () => {
    const center = LevelBounds.sourceToWebMercator(halfMap, halfMap);
    o(center).deepEquals({ x: 0, y: 0 });

    const topLeft = LevelBounds.sourceToWebMercator(0, 0);
    o(topLeft).deepEquals({ x: -WebMercatorBounds, y: WebMercatorBounds });

    const topRight = LevelBounds.sourceToWebMercator(LevelBounds.Size, 0);
    o(topRight).deepEquals({ x: WebMercatorBounds, y: WebMercatorBounds });

    const bottomRight = LevelBounds.sourceToWebMercator(LevelBounds.Size, LevelBounds.Size);
    o(bottomRight).deepEquals({ x: WebMercatorBounds, y: -WebMercatorBounds });

    const bottomLeft = LevelBounds.sourceToWebMercator(0, LevelBounds.Size);
    o(bottomLeft).deepEquals({ x: -WebMercatorBounds, y: -WebMercatorBounds });
  });

  o('should convert to latLng', () => {
    const center = LevelBounds.sourceToLatLng(halfMap, halfMap);
    o(center).deepEquals({ lat: 0, lng: 0 });

    const topLeft = LevelBounds.sourceToLatLng(0, 0);
    o(topLeft.lng.toFixed(2)).equals('-180.00');
    o(topLeft.lat.toFixed(2)).equals('85.05');

    const topRight = LevelBounds.sourceToLatLng(LevelBounds.Size, 0);
    o(topRight.lng.toFixed(2)).equals('180.00');
    o(topRight.lat.toFixed(2)).equals('85.05');

    const bottomRight = LevelBounds.sourceToLatLng(LevelBounds.Size, LevelBounds.Size);
    o(bottomRight.lng.toFixed(2)).equals('180.00');
    o(bottomRight.lat.toFixed(2)).equals('-85.05');

    const bottomLeft = LevelBounds.sourceToLatLng(0, LevelBounds.Size);
    o(bottomLeft.lng.toFixed(2)).equals('-180.00');
    o(bottomLeft.lat.toFixed(2)).equals('-85.05');
  });
});
