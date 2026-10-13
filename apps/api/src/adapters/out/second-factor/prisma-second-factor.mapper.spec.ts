import { describe, expect, it } from 'vitest';
import { SecondFactor } from '@hexagonal-monorepo-template/domain';
import {
  toPrismaSecondFactorData,
  toSecondFactor,
} from './prisma-second-factor.mapper';

describe('prisma second factor mapper', () => {
  it('rebuilds a pending second factor from its row', () => {
    const factor = toSecondFactor({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: false,
      recoveryCodeDigests: [],
    });

    expect(factor).toMatchObject({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
    });
    expect(factor.isEnrolled()).toBe(false);
  });

  it('rebuilds an enrolled second factor with its recovery code digests', () => {
    const factor = toSecondFactor({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: true,
      recoveryCodeDigests: ['a', 'b'],
    });

    expect(factor.isEnrolled()).toBe(true);
    expect(factor.recoveryCodeDigests).toEqual(['a', 'b']);
  });

  it('writes a second factor as a row', () => {
    expect(
      toPrismaSecondFactorData(
        SecondFactor.begin('u1', 'c1', 'SECRET').confirm(['a']),
      ),
    ).toEqual({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: true,
      recoveryCodeDigests: ['a'],
    });
  });
});
