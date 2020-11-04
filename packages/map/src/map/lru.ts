export class LruCache<T> {
  private values: Map<string, T> = new Map<string, T>();
  private maxEntries: number;

  constructor(maxEntries: number) {
    this.maxEntries = maxEntries;
  }

  public get(key: string): T | undefined {
    const entry = this.values.get(key);
    if (entry != null) {
      // peek the entry, re-insert for LRU strategy
      this.values.delete(key);
      this.values.set(key, entry);
    }

    return entry;
  }

  public put(key: string, value: T): void {
    if (this.values.size >= this.maxEntries) {
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;
      this.values.delete(keyToDelete);
    }

    this.values.set(key, value);
  }
}
