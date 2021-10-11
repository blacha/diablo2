import type * as express from 'express';
import { LogType } from './logger.js';

export interface Request extends express.Request {
  id: string;
  log: LogType;
}

export type Response = express.Response;

export class HttpError {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export interface Route<T = any> {
  url: string;
  contentType?: string;
  process(req: Request, res?: Response): Promise<T>;
}
