import { Diablo2GameStateJson } from './json.js';
import { Emitter } from '@servie/events';

export interface StateEvents {
  'state:changed': [Diablo2GameState];
  'state:replace': [Diablo2GameStateJson];
  'player:move': [{ x: number; y: number }];
}

export class Diablo2GameState extends Emitter<StateEvents> {
  state: Diablo2GameStateJson;

  constructor(id: string) {
    super();
    this.state = {
      id,
      createdAt: Date.now(),
      map: { act: 0, difficulty: 0, id: 0, isHardcore: true },
      player: {
        id: -1,
        x: 0,
        y: 0,
        type: 'player',
        updatedAt: 0,
        level: 0,
        xp: { current: 0, start: 0, diff: 0 },
        life: 0,
        name: '',
      },
      units: [],
      items: [],
      objects: [],
      kills: [],
    };

    this.on('player:move', this.playerMove);
    this.on('state:replace', this.stateReplace);
  }

  playerMove = (pt: { x: number; y: number }): void => {
    if (pt.x === this.state.player.x && pt.y === this.state.player.y) return;
    this.state.player.x = pt.x;
    this.state.player.y = pt.y;

    this.emit('state:changed', this);
  };

  stateReplace = (state: Diablo2GameStateJson): void => {
    // TODO detect if state actually changed
    this.state = state;
    this.emit('state:changed', this);
  };
}
