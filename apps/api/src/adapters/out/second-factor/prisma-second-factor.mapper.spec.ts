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
    });

    expect(factor).toMatchObject({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
    });
    expect(factor.isEnrolled()).toBe(false);
  });

  it('rebuilds an enrolled second factor from its row', () => {
    expect(
      toSecondFactor({
        userId: 'u1',
        companyId: 'c1',
        secret: 'SECRET',
        enrolled: true,
      }).isEnrolled(),
    ).toBe(true);
  });

  it('writes a second factor as a row', () => {
    expect(
      toPrismaSecondFactorData(SecondFactor.begin('u1', 'c1', 'SECRET').confirm()),
    ).toEqual({
      userId: 'u1',
      companyId: 'c1',
      secret: 'SECRET',
      enrolled: true,
    });
  });
});
