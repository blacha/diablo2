import cors from 'cors';
import * as express from 'express';
import * as fs from 'fs';
import 'source-map-support/register.js';
import * as ulid from 'ulid';
import { Log } from './logger.js';
import { Diablo2Path, MapCommand, MapProcess } from './map/map.process.js';
import { HttpError, Request, Route } from './route.js';
import { HealthRoute } from './routes/health.js';
import { MapImageRoute } from './routes/map.image.js';
import { MapActRoute, MapRoute } from './routes/map.js';

if (!fs.existsSync(MapCommand)) Log.warn({ path: MapCommand }, `Diablo2Map:Missing`);
if (!fs.existsSync(Diablo2Path)) Log.warn({ path: Diablo2Path }, `Diablo2Path:Missing`);

const html = fs.readFileSync('./www/index.html');
const js = fs.readFileSync('./www/index.js').toString().replace('process.env.MAP_HOST', "''");

class Diablo2MapServer {
  server = express.default();
  port = parseInt(process.env.PORT ?? '8899', 10);

  constructor() {
    this.server.use(cors());
    this.server.get('/', (ex: express.Request, res: express.Response) => {
      res.status(200);
      res.header('text/html');
      res.end(html);
    });
    this.server.get('/index.js', (ex: express.Request, res: express.Response) => {
      res.status(200);
      res.header('text/javascript');
      res.end(js);
    });
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
    await MapProcess.version(Log);
    await MapProcess.start(Log);
    await new Promise<void>((resolve) => {
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
MapServer.bind(new MapActRoute());
MapServer.bind(new MapImageRoute());
MapServer.init().catch((e) => {
  console.log(e);
  Log.fatal({ error: e }, 'Uncaught Exception');
});
