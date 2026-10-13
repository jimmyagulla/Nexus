import { IIdGenerator } from '@hexagonal-monorepo-template/ports';

export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return globalThis.crypto.randomUUID();
  }
}
