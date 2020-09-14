import pino from 'pino';
import { PrettyTransform } from 'pretty-json-log';
import { ulid } from 'ulid';

const pinoLogger = process.stdout.isTTY ? pino(PrettyTransform.stream()) : pino();
export const Log = pinoLogger.child({ id: ulid().toLowerCase() });

Log.level = 'debug';
export type LogType = typeof Log;
