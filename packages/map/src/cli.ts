import express from 'express';
import { Log } from './logger.js';
import { Diablo2Path, MapCluster } from './map/map.process.js';
import { MapServer } from './server.js';
import * as fs from 'fs';

if (!fs.existsSync(Diablo2Path)) Log.warn({ path: Diablo2Path }, `Diablo2Path:Missing`);

MapServer.server.get('/', (ex: express.Request, res: express.Response) => {
  const html = fs.readFileSync('./www/index.html');

  res.status(200);
  res.header('text/html');
  res.end(html);
});
MapServer.server.get('/index.js', (ex: express.Request, res: express.Response) => {
  const js = fs.readFileSync('./www/index.js').toString().replace('process.env.MAP_HOST', "''");

  res.status(200);
  res.header('text/javascript');
  res.end(js);
});

if (process.env['DIABLO2_CLUSTER_SIZE']) {
  const clusterSize = Number(process.env['DIABLO2_CLUSTER_SIZE']);
  if (!isNaN(clusterSize)) MapCluster.ProcessCount = clusterSize;
}

MapServer.init().catch((e) => {
  console.log(e);
  Log.fatal({ error: e }, 'Uncaught Exception');
});
