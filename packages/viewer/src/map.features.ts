import { Diablo2LevelObject } from '@diablo2/data';

export type FeatureMaker = FeatureMakerPolygon | FeatureMakerPoint;

export interface FeatureMakerPoint {
  feature: 'point';
  layer: string;
}

export interface FeatureMakerPolygon {
  feature: 'polygon';
  width: number;
  height: number;
  xOffset?: number;
  yOffset?: number;
  layer: string;
}

export type MapObjectFilter = (f: Diablo2LevelObject) => FeatureMaker | null | void | false;
