import cors from 'cors';
import * as express from 'express';
import 'source-map-support/register.js';
import * as ulid from 'ulid';
import { Log } from './logger.js';
import { MapCluster } from './map/map.process.js';
import { HttpError, Request, Route } from './route.js';
import { HealthRoute } from './routes/health.js';
import { MapImageRoute } from './routes/map.image.js';
import { MapActLevelRoute, MapActRoute, MapRoute } from './routes/map.js';

class Diablo2MapServer {
  server = express.default();
  port = parseInt(process.env.PORT ?? '8899', 10);

  constructor() {
    this.server.use(cors());
  }

  bind(route: Route): void {
    Log.info({ url: route.url }, 'Bind');
    this.server.get(route.url, async (ex: express.Request, res: express.Response, next: express.NextFunction) => {
      const req = ex as Request;
      req.id = ulid.ulid();
      req.log = Log.child({ id: req.id });
      const startTime = Date.now();
      try {
        const output = await route.process(req, res);
        if (output != null) {
          res.status(200);
          if (Buffer.isBuffer(output)) {
            res.header('content-type', 'image/png');
            res.end(output);
          } else {
            res.json(output);
          }
        }
      } catch (e) {
        if (e instanceof HttpError) {
          req.log.warn(e.message);
          res.status(e.status ?? 500);
          res.json({ id: req.id, message: e.message });
        } else {
          req.log.error({ err: e }, 'Failed to run');
          res.status(500);
          res.json({ id: req.id, message: `Internal server error` });
        }
      }
      const duration = Date.now() - startTime;
      req.log.info({ duration, status: res.statusCode }, req.url);
      next();
    });
  }

  async init(): Promise<void> {
    this.bind(new HealthRoute());
    this.bind(new MapRoute());
    this.bind(new MapActRoute());
    this.bind(new MapActLevelRoute());
    this.bind(new MapImageRoute());

    await new Promise<void>((resolve) => {
      this.server.listen(this.port, () => {
        Log.info(
          {
            port: this.port,
            url: 'http://localhost:' + this.port,
            processes: MapCluster.ProcessCount,
            version: process.env.GIT_VERSION,
            hash: process.env.GIT_HASH,
          },
          'Server started...',
        );
        resolve();
      });
    });
  }
}

export const MapServer = new Diablo2MapServer();
