import { IClock } from '@hexagonal-monorepo-template/ports';

export class FixedClock implements IClock {
  constructor(private readonly instant: Date) {}

  now(): Date {
    return this.instant;
  }
}
