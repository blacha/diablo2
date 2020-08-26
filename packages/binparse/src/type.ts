export interface StrutParserContext {
  /** Current offset */
  offset: number;
  /** Offset the current strut parser started at */
  startOffset: number;
  /** Max packet length if read in */
  packetLength?: number;
}

export interface StrutType<T> {
  name: string;
  parse(bytes: number[], pkt: StrutParserContext): T;
}

export type StrutAny = StrutType<any>;
export type StrutEval<T> = T extends any[] | Date ? T : { [Key in keyof T]: T[Key] };
export type StrutInfer<T> = T extends StrutType<infer K> ? StrutEval<K> : never;
