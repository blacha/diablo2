import * as NodeCanvas from 'canvas';
import { MapProcess } from '../map/map.process.js';
import { HttpError, Request, Route } from '../route.js';
import { AreaLevel } from '../viewer/area.name.js';
import { MapRender } from '../viewer/render.js';
import { getDifficulty, isInSeedRange } from './map.js';

export class MapImageRoute implements Route {
  url = '/v1/map/:seed/:difficulty/:level.png';

  async process(req: Request): Promise<Buffer> {
    const { seed, difficulty, level } = await MapImageRoute.validateParams(req);
    const maps = await MapProcess.map(seed, difficulty, req.log);
    const zone = maps[level];
    if (zone == null) throw new HttpError(422, 'Invalid level');

    const canvas = NodeCanvas.createCanvas(zone.size.width, zone.size.height + 32);

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, zone.size.width, zone.size.height);
    await MapRender.render(zone, ctx, { ...zone.offset, ...zone.size });

    const zoneName = AreaLevel[zone.id];

    ctx.fillStyle = 'black';
    ctx.font = '24px Sans';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(zoneName, 5, zone.size.height + 16);

    ctx.textAlign = 'right';
    ctx.font = '16px Sans';
    ctx.fillText(
      `${zone.offset.x}, ${zone.offset.y} (${zone.size.width}x${zone.size.height})`,
      zone.size.width - 5,
      zone.size.height + 16,
    );

    return canvas.toBuffer('image/png');
  }

  static async validateParams(req: Request): Promise<{ seed: number; difficulty: number; level: number }> {
    const seed = Number(req.params.seed);
    if (isNaN(seed) || !isInSeedRange(seed)) throw new HttpError(422, 'Invalid seed');

    const difficulty = getDifficulty(req.params.difficulty);
    if (difficulty == null) throw new HttpError(422, 'Invalid difficulty');

    const level = Number(req.params.level);
    if (isNaN(level)) throw new HttpError(422, 'Invalid level');

    return { seed, difficulty, level };
  }
}
