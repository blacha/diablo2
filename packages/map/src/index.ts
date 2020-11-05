import cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import 'source-map-support/register';
import * as ulid from 'ulid';
import { Log } from './logger';
import { Diablo2Path, MapCommand, MapProcess } from './map/map.process';
import { HttpError, Request, Response, Route } from './route';
import { HealthRoute } from './routes/health';
import { MapRoute } from './routes/map';

if (!fs.existsSync(MapCommand)) {
  Log.fatal(`Cannot find ${MapCommand}`);
  process.exit(1);
}

if (!fs.existsSync(Diablo2Path)) {
  Log.fatal(`Cannot find ${Diablo2Path}`);
  process.exit(1);
}

class Diablo2MapServer {
  server = express.default();
  port = parseInt(process.env.PORT ?? '8899', 10);

  constructor() {
    this.server.use(cors());
  }

  bind(route: Route): void {
    Log.info({ url: route.url }, 'Bind');
    this.server.get(route.url, async (ex: express.Request, res: Response, next: express.NextFunction) => {
      const req = ex as Request;
      req.id = ulid.ulid();
      req.log = Log.child({ id: req.id });
      const startTime = Date.now();
      try {
        const output = await route.process(req, res);
        if (output != null) {
          res.status(200);
          res.json(output);
        }
      } catch (e) {
        if (e instanceof HttpError) {
          req.log.warn(e.message);
          res.status(e.status ?? 500);
          res.json({ id: req.id, message: e.message });
        } else {
          req.log.error({ error: e }, 'Failed to run');
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
    await MapProcess.version(Log);
    await MapProcess.start(Log);
    await new Promise((resolve) => {
      this.server.listen(this.port, () => {
        Log.info({ port: this.port }, 'Server started...');
        resolve();
      });
    });
  }
}

export const MapServer = new Diablo2MapServer();

MapServer.bind(new HealthRoute());
MapServer.bind(new MapRoute());
MapServer.init().catch((e) => {
  console.log(e);
  Log.fatal({ error: e }, 'Uncaught Exception');
});
