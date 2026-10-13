import { SecondFactor } from '@hexagonal-monorepo-template/domain';

export interface ISecondFactorRepository {
  findByUserId(userId: string): Promise<SecondFactor | null>;
  save(factor: SecondFactor): Promise<void>;
}

export const ISecondFactorRepository = Symbol('ISecondFactorRepository');
