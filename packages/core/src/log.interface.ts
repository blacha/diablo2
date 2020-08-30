export interface Logger {
  info(obj: Record<string, unknown>, msg: string): void;
}
