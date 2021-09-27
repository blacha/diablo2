import { Route } from '../route.js';

export interface HealthResponse {
  message: 'ok';
}

export class HealthRoute implements Route {
  url = '/health';
  async process(): Promise<HealthResponse> {
    return { message: 'ok' };
  }
}
