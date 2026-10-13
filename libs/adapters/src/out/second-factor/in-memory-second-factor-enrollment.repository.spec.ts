import { describe, expect, it } from 'vitest';
import { SecondFactorEnrollment } from '@hexagonal-monorepo-template/domain';
import { InMemorySecondFactorEnrollmentRepository } from './in-memory-second-factor-enrollment.repository';

function enrollment(id: string, accountId: string): SecondFactorEnrollment {
  return SecondFactorEnrollment.start(id, accountId, 'JBSWY3DPEHPK3PXP');
}

describe('InMemorySecondFactorEnrollmentRepository', () => {
  it('finds an inserted enrollment by its id', async () => {
    const enrollments = new InMemorySecondFactorEnrollmentRepository();
    const pending = enrollment('en1', 'a1');

    await enrollments.insert(pending);

    expect(await enrollments.findById('en1')).toEqual(pending);
  });

  it('returns nothing for an unknown id', async () => {
    const enrollments = new InMemorySecondFactorEnrollmentRepository();

    await enrollments.insert(enrollment('en1', 'a1'));

    expect(await enrollments.findById('en2')).toBeNull();
  });

  it('finds the enrollment of an account', async () => {
    const enrollments = new InMemorySecondFactorEnrollmentRepository();
    const pending = enrollment('en1', 'a1');

    await enrollments.insert(enrollment('en2', 'a2'));
    await enrollments.insert(pending);

    expect(await enrollments.findByAccountId('a1')).toEqual(pending);
  });

  it('returns nothing for an account without enrollment', async () => {
    const enrollments = new InMemorySecondFactorEnrollmentRepository();

    await enrollments.insert(enrollment('en1', 'a1'));

    expect(await enrollments.findByAccountId('a2')).toBeNull();
  });

  it('keeps the saved enrollment over the previous one', async () => {
    const enrollments = new InMemorySecondFactorEnrollmentRepository();
    await enrollments.insert(enrollment('en1', 'a1'));
    const replaced = enrollment('en1', 'a1');

    await enrollments.save(replaced);

    expect(await enrollments.findById('en1')).toEqual(replaced);
  });
});
