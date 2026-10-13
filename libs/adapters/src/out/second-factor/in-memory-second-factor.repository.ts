import { SecondFactor } from '@hexagonal-monorepo-template/domain';
import { ISecondFactorRepository } from '@hexagonal-monorepo-template/ports';

export class InMemorySecondFactorRepository implements ISecondFactorRepository {
  constructor(private readonly factors = new Map<string, SecondFactor>()) {}

  async findByUserId(userId: string): Promise<SecondFactor | null> {
    return this.factors.get(userId) ?? null;
  }

  async save(factor: SecondFactor): Promise<void> {
    this.factors.set(factor.userId, factor);
  }
}
