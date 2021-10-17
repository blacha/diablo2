import { Act, ActUtil, Difficulty, DifficultyUtil, toHex, Diablo2Map } from '@diablo2/data';
import { MapProcess } from '../map/map.process.js';
import { HttpError, Request, Route } from '../route.js';

export const isInSeedRange = (seed: number): boolean => seed > 0 && seed < 0xffffffff;

export class MapRoute implements Route {
  url = '/v1/map/:seed/:difficulty.json';

  async process(req: Request): Promise<Diablo2Map> {
    const { seed, difficulty } = await MapRoute.validateParams(req);
    const levels = await MapProcess.map(seed, difficulty, -1, req.log);
    req.log = req.log.child({ seed: toHex(seed, 8), difficulty: Difficulty[difficulty] });
    return { id: req.id, seed, difficulty, levels };
  }

  static validateParams(req: Request): { seed: number; difficulty: number } {
    const seed = Number(req.params.seed);
    if (isNaN(seed) || !isInSeedRange(seed)) throw new HttpError(422, 'Invalid seed');

    const difficulty = DifficultyUtil.fromString(req.params.difficulty);
    if (difficulty == null) throw new HttpError(422, 'Invalid difficulty');

    return { seed, difficulty };
  }
}

export class MapActRoute implements Route {
  url = '/v1/map/:seed/:difficulty/:act.json';

  async process(req: Request): Promise<Diablo2Map> {
    const { seed, difficulty, act } = await MapActRoute.validateParams(req);
    const levels = await MapProcess.map(seed, difficulty, act, req.log);
    req.log = req.log.child({ seed: toHex(seed, 8), difficulty: Difficulty[difficulty], act: Act[act] });
    return { id: req.id, seed, difficulty, levels, act };
  }

  static validateParams(req: Request): { seed: number; difficulty: number; act: number } {
    const act = ActUtil.fromString(req.params.act);
    if (act == null) throw new HttpError(422, 'Invalid act');

    return { ...MapRoute.validateParams(req), act };
  }
}
