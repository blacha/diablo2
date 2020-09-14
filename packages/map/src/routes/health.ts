import { Route } from '../route';

export interface HealthResponse {
  message: 'ok';
}

export class HealthRoute implements Route {
  url = '/healthz';
  async process(): Promise<HealthResponse> {
    return { message: 'ok' };
  }
}
