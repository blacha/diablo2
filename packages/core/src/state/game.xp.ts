import { XpStateJson } from './json';

export class XpState {
  start: number;
  current: number;

  get diff(): number {
    return this.current - this.start;
  }

  track(exp: number): void {
    if (this.start == null) {
      this.start = exp;
      this.current = exp;
    } else {
      this.current = this.current + exp;
    }
  }

  set(xp: number): void {
    if (this.start == null || this.start < 500) {
      this.start = xp;
      this.current = xp;
      return;
    }

    this.current = xp;
    const diff = this.current - this.start;
    if (diff / this.start > 100) {
      this.start = xp;
    }
  }

  toJson(): XpStateJson {
    return {
      start: this.start,
      current: this.current,
      diff: this.diff,
    };
  }
}
