import pino from 'pino';
import { ulid } from 'ulid';
import { PrettyTransform } from 'pretty-json-log';
import { Logger } from '@diablo2/bintools';

export const id = ulid().toLowerCase();
const pinoLogger = process.stdout.isTTY ? pino(PrettyTransform.stream()) : pino();
export const Log = pinoLogger.child({ id });

Log.level = 'debug';
export type LogType = Logger;
