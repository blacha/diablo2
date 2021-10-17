import { Diablo2Level } from '@diablo2/data';

export interface MapGenMessageInit {
  type: 'init';
}

export interface MapGenMessageInfo {
  type: 'info';
  seed: number;
  difficulty: number;
  act?: number;
  map?: number;
}

export interface MapGenMessageMap extends Diablo2Level {
  type: 'map';
}

export interface MapGenMessageDone {
  type: 'done';
}

export type Diablo2MapGenMessage = MapGenMessageDone | MapGenMessageMap | MapGenMessageInfo | MapGenMessageInit;
