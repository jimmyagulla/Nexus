import { IIdGenerator } from '@hexagonal-monorepo-template/ports';

export class SequentialIdGenerator implements IIdGenerator {
  private count = 0;

  next(): string {
    this.count += 1;
    return `id-${this.count}`;
  }
}
