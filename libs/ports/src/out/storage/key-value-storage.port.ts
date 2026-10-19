/** Small texts kept on the device, under a key, from one visit to the next. */
export interface IKeyValueStorage {
  /** The text kept under the key, or null when there is none. */
  read(key: string): string | null;
  write(key: string, value: string): void;
}

export const IKeyValueStorage = Symbol('IKeyValueStorage');
