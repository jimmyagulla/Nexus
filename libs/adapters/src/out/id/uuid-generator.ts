import { IIdGenerator } from '@hexagonal-monorepo-template/ports';

export class UuidGenerator implements IIdGenerator {
  next(): string {
    return globalThis.crypto.randomUUID();
  }
}
