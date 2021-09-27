import { Difficulty } from '@diablo2/data';
import { MapRouteResponse } from '../map/map.js';
import { MapProcess } from '../map/map.process.js';
import { HttpError, Request, Route } from '../route.js';

const isInSeedRange = (seed: number): boolean => seed > 0 && seed < 0xffffffff;

function getDifficulty(res: string): Difficulty | null {
  const resIsNumber = Number(res);
  if (isNaN(resIsNumber)) return Difficulty[res as any] as any;
  if (resIsNumber in Difficulty) return resIsNumber;
  return null;
}

export class MapRoute implements Route {
  url = '/v1/map/:seed/:difficulty.json';

  async process(req: Request): Promise<MapRouteResponse> {
    const { seed, difficulty } = await MapRoute.validateParams(req);
    const maps = await MapProcess.map(seed, difficulty, req.log);
    return { id: req.id, seed, difficulty, maps };
  }

  static async validateParams(req: Request): Promise<{ seed: number; difficulty: number }> {
    const seed = Number(req.params.seed);
    if (isNaN(seed) || !isInSeedRange(seed)) throw new HttpError(422, 'Invalid seed');

    const difficulty = getDifficulty(req.params.difficulty);
    if (difficulty == null) throw new HttpError(422, 'Invalid difficulty');

    return { seed, difficulty };
  }
}
