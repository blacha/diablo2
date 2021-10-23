import { Act, ActUtil, Diablo2Level, Diablo2Map, Difficulty, DifficultyUtil, toHex } from '@diablo2/data';
import { MapCluster } from '../map/map.process.js';
import { HttpError, Request, Route } from '../route.js';

export const isInSeedRange = (seed: number): boolean => seed > 0 && seed < 0xffffffff;

/** Dump the entire world for a difficulty/seed */
export class MapRoute implements Route {
  url = '/v1/map/:seed/:difficulty.json';

  async process(req: Request): Promise<Diablo2Map> {
    const { seed, difficulty } = await MapRoute.validateParams(req);
    const levels = await MapCluster.map(seed, difficulty, -1, req.log);
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
/** Grab a specific act form a difficulty */
export class MapActRoute implements Route {
  url = '/v1/map/:seed/:difficulty/:act.json';

  async process(req: Request): Promise<Diablo2Map> {
    const { seed, difficulty, act } = await MapActRoute.validateParams(req);
    const levels = await MapCluster.map(seed, difficulty, act, req.log);
    req.log = req.log.child({ seed: toHex(seed, 8), difficulty: Difficulty[difficulty], act: Act[act] });
    return { id: req.id, seed, difficulty, levels, act };
  }

  static validateParams(req: Request): { seed: number; difficulty: number; act: number } {
    const act = ActUtil.fromString(req.params.act);
    if (act == null) throw new HttpError(422, 'Invalid act');

    return { ...MapRoute.validateParams(req), act };
  }
}

/** Grab a specific level form a act */
export class MapActLevelRoute implements Route {
  url = '/v1/map/:seed/:difficulty/:act/:level.json';

  async process(req: Request): Promise<Diablo2Map> {
    const { seed, difficulty, act, mapId } = await MapActLevelRoute.validateParams(req);
    const levels = await MapCluster.map(seed, difficulty, act, req.log);
    req.log = req.log.child({ seed: toHex(seed, 8), difficulty: Difficulty[difficulty], act: Act[act], mapId });

    const found: Diablo2Level[] = [];
    for (const level of levels) if (level.id === mapId) found.push(level);
    return { id: req.id, seed, difficulty, levels: found, act };
  }

  static validateParams(req: Request): { seed: number; difficulty: number; act: number; mapId: number } {
    const params = MapActRoute.validateParams(req);
    const mapId = Number(req.params.level);
    if (mapId == null || ActUtil.fromLevel(mapId) !== params.act) throw new HttpError(422, 'Invalid map id');

    return { ...params, mapId };
  }
}
