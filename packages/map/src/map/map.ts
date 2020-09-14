export interface Diablo2Map {
  id: string;
}
export interface MapGenMessageInit {
  type: 'init';
}

export interface MapGenMessageInfo {
  type: 'info';
  seed: number;
  difficulty: number;
}

export interface MapGenMessageMap extends Diablo2Map {
  type: 'map';
}

export interface MapGenMessageDone {
  type: 'done';
}

export type Diablo2MapGenMessage = MapGenMessageDone | MapGenMessageMap | MapGenMessageInfo | MapGenMessageInit;
