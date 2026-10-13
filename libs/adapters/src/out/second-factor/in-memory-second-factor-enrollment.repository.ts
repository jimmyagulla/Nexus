import { SecondFactorEnrollment } from '@hexagonal-monorepo-template/domain';
import { ISecondFactorEnrollmentRepository } from '@hexagonal-monorepo-template/ports';

export class InMemorySecondFactorEnrollmentRepository
  implements ISecondFactorEnrollmentRepository
{
  constructor(
    private readonly enrollments = new Map<string, SecondFactorEnrollment>(),
  ) {}

  async insert(enrollment: SecondFactorEnrollment): Promise<void> {
    this.enrollments.set(enrollment.id, enrollment);
  }

  async save(enrollment: SecondFactorEnrollment): Promise<void> {
    this.enrollments.set(enrollment.id, enrollment);
  }

  async findById(
    enrollmentId: string,
  ): Promise<SecondFactorEnrollment | null> {
    return this.enrollments.get(enrollmentId) ?? null;
  }

  async findByAccountId(
    accountId: string,
  ): Promise<SecondFactorEnrollment | null> {
    return (
      [...this.enrollments.values()].find(
        (enrollment) => enrollment.accountId === accountId,
      ) ?? null
    );
  }
}
