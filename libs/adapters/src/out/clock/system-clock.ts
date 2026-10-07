import { IClock } from '@hexagonal-monorepo-template/ports';

export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}
