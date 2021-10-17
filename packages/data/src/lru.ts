export class LruCache<T> {
  private values: Map<string, T> = new Map<string, T>();
  private valuesOld: Map<string, T> = new Map<string, T>();
  private maxEntries: number;

  constructor(maxEntries: number) {
    this.maxEntries = maxEntries;
  }

  public get(key: string): T | undefined {
    let entry = this.values.get(key);
    if (entry == null) {
      entry = this.valuesOld.get(key);
      if (entry == null) return undefined;
      this.valuesOld.delete(key);
      this.values.set(key, entry);
    }

    return entry;
  }

  public set(key: string, value: T): void {
    if (this.values.size >= this.maxEntries) {
      this.valuesOld = this.values;
      this.values = new Map();
    }

    this.values.set(key, value);
  }
}
