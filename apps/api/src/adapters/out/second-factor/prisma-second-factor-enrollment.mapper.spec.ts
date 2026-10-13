import { describe, expect, it } from 'vitest';
import { SecondFactorEnrollmentStatus } from '@hexagonal-monorepo-template/domain';
import {
  PrismaSecondFactorEnrollmentRow,
  toSecondFactorEnrollment,
} from './prisma-second-factor-enrollment.mapper';

function rowOf(
  overrides: Partial<PrismaSecondFactorEnrollmentRow> = {},
): PrismaSecondFactorEnrollmentRow {
  return {
    id: 'enrollment-1',
    accountId: 'account-1',
    secret: 'JBSWY3DPEHPK3PXP',
    status: SecondFactorEnrollmentStatus.PENDING,
    ...overrides,
  };
}

describe('toSecondFactorEnrollment', () => {
  it('maps a prisma row to a pending enrollment', () => {
    const enrollment = toSecondFactorEnrollment(rowOf());

    expect(enrollment.id).toBe('enrollment-1');
    expect(enrollment.accountId).toBe('account-1');
    expect(enrollment.secret).toBe('JBSWY3DPEHPK3PXP');
    expect(enrollment.isConfirmed()).toBe(false);
  });

  it('keeps a confirmed status', () => {
    expect(
      toSecondFactorEnrollment(
        rowOf({ status: SecondFactorEnrollmentStatus.CONFIRMED }),
      ).isConfirmed(),
    ).toBe(true);
  });
});
