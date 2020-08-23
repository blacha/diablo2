import { StrutParserContext, StrutType } from './type';

export class StrutTypeLookup<T, K extends keyof T> implements StrutType<{ value: T[K]; name: keyof T }> {
  name: string;
  type: StrutType<number>;
  lookup: T;

  constructor(name: string, type: StrutType<number>, lookup: T) {
    this.lookup = lookup;
    this.type = type;
    this.name = 'Lookup:' + name;
  }

  parse(bytes: number[], ctx: StrutParserContext): { value: T[K]; name: keyof T } {
    const value = this.type.parse(bytes, ctx) as any;
    const name = (this.lookup as any)[value] as any;
    if (name == null) throw new Error(`${this.name}: Failed to lookup ${value}`);
    return { value, name };
  }
}
