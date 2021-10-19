import { Bounds } from './bounds';
import { Diablo2Level } from '@diablo2/data';
import { MapParams } from './tile';

function isInBounds(pt: { x: number; y: number }, bounds: Bounds): boolean {
  if (pt.x < bounds.x) return false;
  if (pt.y < bounds.y) return false;
  if (pt.x > bounds.x + bounds.width) return false;
  if (pt.y > bounds.y + bounds.height) return false;
  return true;
}

export class LevelRender {
  static ExitSize = 12;

  static render(
    level: Diablo2Level,
    ctx: CanvasRenderingContext2D,
    bounds: Bounds,
    scale = 0.5,
    mapParams?: MapParams,
  ): void {
    ctx.fillStyle = 'white';

    if (mapParams?.rasterFillColor) ctx.fillStyle = String(mapParams?.rasterFillColor).replace('0x', '#');

    const map = level.map;

    for (let yOffset = 0; yOffset < map.length; yOffset++) {
      const line = map[yOffset];
      let fill = false;
      if (line.length === 0) continue;

      if (level.offset.y + yOffset < bounds.y) continue;

      let x = level.offset.x - bounds.x;
      const y = level.offset.y - bounds.y + yOffset;

      for (let i = 0; i < line.length; i++) {
        const xCount = line[i];

        fill = !fill;
        if (!fill) {
          const width = xCount * scale;
          if (width >= 0.2) ctx.fillRect(x * scale, y * scale, width, scale);
        }
        x = x + xCount;
      }
      const xMax = level.offset.x - bounds.x + level.size.width;
      if (fill && x < xMax) ctx.fillRect(x * scale, y * scale, (xMax - x) * scale, scale);
    }
  }

  static renderObjects(zone: Diablo2Level, ctx: CanvasRenderingContext2D, bounds: Bounds, scale = 0.5): void {
    const size = LevelRender.ExitSize * scale;
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
