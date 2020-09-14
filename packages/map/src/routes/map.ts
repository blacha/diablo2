import { Difficulty } from '@diablo2/data';
import { Diablo2Map } from '../map/map';
import { MapProcess } from '../map/map.process';
import { HttpError, Request, Route } from '../route';

const isInSeedRange = (seed: number): boolean => seed > 0 && seed < 0xffffffff;

function getDifficulty(res: string): Difficulty | null {
  const resIsNumber = parseInt(res);
  if (isNaN(resIsNumber)) {
    return Difficulty[res as any] as any;
  }
  if (resIsNumber in Difficulty) return resIsNumber;
  return null;
}

export interface MapRouteResponse {
  id: string;
  seed: number;
  difficulty: number;
  maps: Record<number, Diablo2Map>;
}

export class MapRoute implements Route {
  url = '/v1/map/:seed/:difficulty.json';

  async process(req: Request): Promise<MapRouteResponse> {
    const { seed, difficulty } = await MapRoute.validateParams(req);
    const maps = await MapProcess.map(seed, difficulty, req.log);
    return { id: req.id, seed, difficulty, maps };
  }

  static async validateParams(req: Request): Promise<{ seed: number; difficulty: number }> {
    const seed = parseInt(req.params.seed, 10);
    if (isNaN(seed) || !isInSeedRange(seed)) throw new HttpError(422, 'Invalid seed');

    const difficulty = getDifficulty(req.params.difficulty);
    if (difficulty == null) throw new HttpError(422, 'Invalid difficulty');

    return { seed, difficulty };
  }
}
