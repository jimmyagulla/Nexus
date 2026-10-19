import { IIdGenerator } from '@hexagonal-monorepo-template/ports';

/** The only place that draws a UUID: every other piece of code receives an IIdGenerator. */
export class RandomUuidGenerator implements IIdGenerator {
  next(): string {
    return globalThis.crypto.randomUUID();
  }
}
