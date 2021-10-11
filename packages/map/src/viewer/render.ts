import { Diablo2Map } from '../map/map';
import { Bounds } from './bounds';

export class MapRender {
  static render(zone: Diablo2Map, ctx: CanvasRenderingContext2D, bounds: Bounds, scale = 0.5): void {
    ctx.fillStyle = 'white';
    const map = zone.map;

    for (let yOffset = 0; yOffset < map.length; yOffset++) {
      const line = map[yOffset];
      let fill = false;
      if (line.length === 0) continue;

      if (zone.offset.y + yOffset < bounds.y) continue;

      let x = zone.offset.x - bounds.x;
      const y = zone.offset.y - bounds.y + yOffset;

      for (let i = 0; i < line.length; i++) {
        const xCount = line[i];

        fill = !fill;
        if (!fill) {
          const width = xCount * scale;
          if (width >= 0.2) ctx.fillRect(x * scale, y * scale, width, scale);
        }
        x = x + xCount;
      }
      const xMax = zone.offset.x - bounds.x + zone.size.width;
      if (fill && x < xMax) ctx.fillRect(x * scale, y * scale, (xMax - x) * scale, scale);
    }
  }
}
