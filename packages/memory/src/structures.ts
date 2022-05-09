import { Process } from './process.js';

export type PointerFetcher<T> = (proc: Process) => Promise<T>;

// export type UnitPlayer = StrutInfer<typeof D2rUnitAnyPlayerStrut>;
