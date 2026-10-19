import { IKeyValueStorage } from '@hexagonal-monorepo-template/ports';

/** Keeps the texts in the process: they do not outlive it. */
export class InMemoryKeyValueStorage implements IKeyValueStorage {
  constructor(readonly values = new Map<string, string>()) {}

  read(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  write(key: string, value: string): void {
    this.values.set(key, value);
  }
}
