import { StrutInfer } from 'binparse';
import { Process } from './process.js';
import { D2cStrut } from './struts/d2c.js';
import { D2rStrut } from './struts/d2r.js';

export type PointerFetcher<T> = (proc: Process) => Promise<T>;

export type UnitPlayer = StrutInfer<typeof D2rStrut.UnitPlayer> | StrutInfer<typeof D2cStrut.UnitPlayer>;
