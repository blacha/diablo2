export interface Diablo2Map {
  id: number;
  name: string;
  map: number[][];
  objects: Diablo2Object[];
  offset: { x: number; y: number };
  size: { width: number; height: number };
}

export type Diablo2Object = Diablo2MapObject | Diablo2MapNpc | Diablo2MapExit;

export interface Diablo2MapObject {
  id: number;
  type: 'object';
  x: number;
  y: number;
  name?: string;
}
export interface Diablo2MapNpc {
  id: number;
  type: 'npc';
  x: number;
  y: number;
  name?: string;
}
export interface Diablo2MapExit {
  id: number;
  type: 'exit';
  x: number;
  y: number;
  name?: string;
}

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
