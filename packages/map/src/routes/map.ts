import { Act, Difficulty, toHex } from '@diablo2/data';
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

function getAct(res: string): Act | null {
  const resIsNumber = Number(res);
  if (isNaN(resIsNumber)) return Act[res as any] as any;
  if (resIsNumber in Act) return resIsNumber;
  return null;
}

export class MapRoute implements Route {
  url = '/v1/map/:seed/:difficulty.json';

  async process(req: Request): Promise<MapRouteResponse> {
    const { seed, difficulty } = await MapRoute.validateParams(req);
    const maps = await MapProcess.map(seed, difficulty, -1, req.log);
    req.log = req.log.child({ seed: toHex(seed, 8), difficulty: Difficulty[difficulty] });

    return { id: req.id, seed, difficulty, maps };
  }

  static validateParams(req: Request): { seed: number; difficulty: number } {
    const seed = Number(req.params.seed);
    if (isNaN(seed) || !isInSeedRange(seed)) throw new HttpError(422, 'Invalid seed');

    const difficulty = getDifficulty(req.params.difficulty);
    if (difficulty == null) throw new HttpError(422, 'Invalid difficulty');

    return { seed, difficulty };
  }
}

export class MapActRoute implements Route {
  url = '/v1/map/:seed/:difficulty/:act.json';

  async process(req: Request): Promise<MapRouteResponse & { act: number }> {
    const { seed, difficulty, act } = await MapActRoute.validateParams(req);
    const maps = await MapProcess.map(seed, difficulty, act, req.log);
    req.log = req.log.child({ seed: toHex(seed, 8), difficulty: Difficulty[difficulty], act: Act[act] });
    return { id: req.id, seed, difficulty, maps, act };
  }

  static validateParams(req: Request): { seed: number; difficulty: number; act: number } {
    const act = getAct(req.params.act);
    if (act == null) throw new HttpError(422, 'Invalid act');

    return { ...MapRoute.validateParams(req), act };
  }
}
