import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { RolesGuard } from './roles.guard';
import { AuthenticatedRequest } from './authenticated-request';

function contextOf(request: AuthenticatedRequest): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
}

describe('RolesGuard', () => {
  it('allows an employer on an employer route', () => {
    const reflector = {
      getAllAndOverride: () => [UserRole.EMPLOYER],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(
      guard.canActivate(
        contextOf({
          headers: {},
          actor: {
            userId: 'u1',
            companyId: 'c1',
            role: UserRole.EMPLOYER,
          },
        }),
      ),
    ).toBe(true);
  });

  it('refuses a non-employer', () => {
    const reflector = {
      getAllAndOverride: () => [UserRole.EMPLOYER],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(() =>
      guard.canActivate(
        contextOf({
          headers: {},
          actor: {
            userId: 'u1',
            companyId: 'c1',
            role: UserRole.EMPLOYEE,
          },
        }),
      ),
    ).toThrow(ForbiddenException);
  });
});
