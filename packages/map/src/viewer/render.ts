import { Diablo2Map } from '../map/map';
import { Bounds } from './bounds';

function isInBounds(pt: { x: number; y: number }, bounds: Bounds): boolean {
  if (pt.x < bounds.x) return false;
  if (pt.y < bounds.y) return false;
  if (pt.x > bounds.x + bounds.width) return false;
  if (pt.y > bounds.y + bounds.height) return false;
  return true;
}

export class MapRender {
  static ExitSize = 12;

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

  static renderObjects(zone: Diablo2Map, ctx: CanvasRenderingContext2D, bounds: Bounds, scale = 0.5): void {
    const size = MapRender.ExitSize * scale;
    const halfSize = size / 2;
    for (const obj of zone.objects) {
      if (!isInBounds({ x: obj.x + zone.offset.x, y: obj.y + zone.offset.y }, bounds)) continue;

      if (obj.type === 'exit') {
        ctx.fillStyle = 'red';
        ctx.fillRect(obj.x - halfSize, obj.y - halfSize, size, size);
      }

      if (obj.type === 'object' && obj.name?.toLowerCase() === 'waypoint') {
        ctx.fillStyle = 'blue';
        ctx.fillRect(obj.x - halfSize, obj.y - halfSize, size, size);
      }
    }
  }
}
