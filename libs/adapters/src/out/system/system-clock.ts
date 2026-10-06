import { randomUUID } from 'node:crypto';
import { IClock, IIdGenerator } from '@hexagonal-monorepo-template/ports';

export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}

export class UuidGenerator implements IIdGenerator {
  next(): string {
    return randomUUID();
  }
}
