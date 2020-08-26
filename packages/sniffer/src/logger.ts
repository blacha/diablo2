import pino from 'pino';
import { ulid } from 'ulid';
import { PrettyTransform } from 'pretty-json-log';

const pinoLogger = process.stdout.isTTY ? pino(PrettyTransform.stream()) : pino();
export const Log = pinoLogger.child({ id: ulid().toLowerCase() });

Log.level = 'debug';
export type LogType = typeof Log;
