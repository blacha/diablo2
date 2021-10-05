export interface Diablo2Map {
  id: number;
  name: string;
  map: number[][];
  objects: { id: number; type: 'object'; x: number; y: number }[];
  offset: { x: number; y: number };
  size: { width: number; height: number };
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

export interface MapRouteResponse {
  id: string;
  seed: number;
  difficulty: number;
  maps: Record<number, Diablo2Map>;
}
