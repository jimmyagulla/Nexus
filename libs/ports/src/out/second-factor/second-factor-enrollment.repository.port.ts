import { SecondFactorEnrollment } from '@hexagonal-monorepo-template/domain';

export interface ISecondFactorEnrollmentRepository {
  insert(enrollment: SecondFactorEnrollment): Promise<void>;
  save(enrollment: SecondFactorEnrollment): Promise<void>;
  findById(enrollmentId: string): Promise<SecondFactorEnrollment | null>;
  findByAccountId(accountId: string): Promise<SecondFactorEnrollment | null>;
}

export const ISecondFactorEnrollmentRepository = Symbol(
  'ISecondFactorEnrollmentRepository',
);
