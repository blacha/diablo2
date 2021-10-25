import { Diablo2GameStateJson } from './json.js';

export class Diablo2GameState {
  state: Diablo2GameStateJson;

  constructor(id: string) {
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
  }
}
