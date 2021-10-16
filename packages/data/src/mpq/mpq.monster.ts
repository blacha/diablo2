import { Diablo2MpqData } from './mpq.js';

export interface Diablo2MpqMonster {
  id: number;
  baseId: number;
  nameLangId: number;
}

export class Diablo2MpqMonsters {
  /** SuperUniqueId -> Name */
  superUniques: string[] = [
    'Bishibosh',
    'Bonebreaker',
    'Coldcrow',
    'Rakanishu',
    'Treehead WoodFist',
    'Griswold',
    'The Countess',
    'Pitspawn Fouldog',
    'Flamespike the Crawler',
    'Bone Ash',
    'Radament',
    'Bloodwitch the Wild',
    'Fangskin',
    'Beetleburst',
    'Creeping Feature',
    'Coldworm the Burrower',
    'Fire Eye',
    'Dark Elder',
    'The Summoner',
    'Ancient Kaa the Soulless',
    'The Smith',
    'Sszark the Burning',
    'Witch Doctor Endugu',
    'Stormtree',
    'Battlemaid Sarina',
    'Icehawk Riftwing',
    'Ismail Vilehand',
    'Geleb Flamefinger',
    'Bremm Sparkfist',
    'Toorc Icefist',
    'Wyand Voidbringer',
    'Maffer Dragonhand',
    'Darkwing',
    'The Tormentor',
    'Taintbreeder',
    'Riftwraith the Cannibal',
    'Infector of Souls',
    'Lord De Seis',
    'Grand Vizier of Chaos',
    'The Cow King',
    'Corpsefire',
    'Hephasto The Armorer',
    'Shenk the Overseer',
    'Talic',
    'Madawc',
    'Korlic',
    'Axe Dweller',
    'Bonesaw Breaker',
    'Dac Farren',
    'Eldritch the Rectifier',
    'Eyeback the Unleashed',
    'Thresh Socket',
    'Pindleskin',
    'Snapchip Shatter',
    "Hell's Belle",
    'Vinvear Molech',
    'Sharptooth Slayer',
    'Magma Torquer',
    'Blaze Ripper',
    'Frozenstein',
    'Nihlathak Boss',
    'Colenzo the Annihilator',
    'Achmel the Cursed',
    'Bartuc the Bloody',
    'Ventar the Unholy',
    'Lister the Tormentor',
    '',
  ];

  /** MonsterId -> Monster translation string */
  monsters: Map<number, Diablo2MpqMonster> = new Map();
  /** baseMonsterId -> Monster state */
  state: Map<number, number[]> = new Map();

  mpq: Diablo2MpqData;

  constructor(mpq: Diablo2MpqData) {
    this.mpq = mpq;
  }

  /**
   * Number of normal monsters
   * For v1.13c diablo2 this is 734
   */
  size = 0;

  superUniqueName(superUniqueId: number): string | undefined {
    return this.superUniques[superUniqueId];
  }

  name(monsterId: number): string | undefined {
    if (monsterId >= this.size) return this.superUniques[monsterId - this.size];
    return this.mpq.t(this.monsters.get(monsterId)?.nameLangId);
  }

  add(monsterId: number, mon: Diablo2MpqMonster): void {
    this.size++;
    this.monsters.set(monsterId, mon);
  }

  getState(baseMonsterId: number): number[] {
    return this.state.get(baseMonsterId) ?? [];
  }

  addState(baseMonsterId: number, state: number[]): void {
    if (!this.monsters.has(baseMonsterId)) {
      throw new Error(`Unable to add monster state missing monster ${baseMonsterId}`);
    }
    this.state.set(baseMonsterId, state);
  }
}
