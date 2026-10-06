import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { RolesGuard } from './roles.guard';
import { AuthenticatedRequest } from '../authenticated-request';

function contextOf(request: AuthenticatedRequest): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
}

function reflectorOf(roles: UserRole[] | undefined): Reflector {
  return {
    getAllAndOverride: () => roles,
  } as unknown as Reflector;
}

describe('RolesGuard', () => {
  it('allows an employer on an employer route', () => {
    const guard = new RolesGuard(reflectorOf([UserRole.EMPLOYER]));

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
    const guard = new RolesGuard(reflectorOf([UserRole.EMPLOYER]));

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

  it('refuses an actor without role', () => {
    const guard = new RolesGuard(reflectorOf([UserRole.EMPLOYER]));

    expect(() =>
      guard.canActivate(
        contextOf({
          headers: {},
          actor: { userId: 'u1', companyId: 'c1', role: null },
        }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('lets a route without declared roles through', () => {
    const guard = new RolesGuard(reflectorOf(undefined));

    expect(guard.canActivate(contextOf({ headers: {} }))).toBe(true);
  });

  it('lets a route with an empty role list through', () => {
    const guard = new RolesGuard(reflectorOf([]));

    expect(guard.canActivate(contextOf({ headers: {} }))).toBe(true);
  });
});
