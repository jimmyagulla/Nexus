import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { CompanyScopeGuard } from './company-scope.guard';
import { AuthenticatedRequest } from '../authenticated-request';

function contextOf(request: AuthenticatedRequest): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => request }),
  } as ExecutionContext;
}

function reflectorOf(allowWithoutCompany: boolean | undefined): Reflector {
  return {
    getAllAndOverride: () => allowWithoutCompany,
  } as unknown as Reflector;
}

const employer = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('CompanyScopeGuard', () => {
  it('allows an actor acting on their own company', () => {
    const guard = new CompanyScopeGuard(reflectorOf(undefined));

    expect(
      guard.canActivate(
        contextOf({ headers: {}, params: { companyId: 'c1' }, actor: employer }),
      ),
    ).toBe(true);
  });

  it('refuses an actor acting on another company', () => {
    const guard = new CompanyScopeGuard(reflectorOf(undefined));

    expect(() =>
      guard.canActivate(
        contextOf({ headers: {}, params: { companyId: 'c2' }, actor: employer }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('refuses a route without company parameter', () => {
    const guard = new CompanyScopeGuard(reflectorOf(undefined));

    expect(() =>
      guard.canActivate(contextOf({ headers: {}, actor: employer })),
    ).toThrow(ForbiddenException);
  });

  it('refuses a route whose company parameter is empty', () => {
    const guard = new CompanyScopeGuard(reflectorOf(undefined));

    expect(() =>
      guard.canActivate(contextOf({ headers: {}, params: {}, actor: employer })),
    ).toThrow(ForbiddenException);
  });

  it('refuses an actor not bound to a company', () => {
    const guard = new CompanyScopeGuard(reflectorOf(undefined));

    expect(() =>
      guard.canActivate(
        contextOf({
          headers: {},
          params: { companyId: 'c1' },
          actor: { userId: 'u1', companyId: null, role: null },
        }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('refuses an unauthenticated request', () => {
    const guard = new CompanyScopeGuard(reflectorOf(undefined));

    expect(() =>
      guard.canActivate(contextOf({ headers: {}, params: { companyId: 'c1' } })),
    ).toThrow(ForbiddenException);
  });

  it('allows a route explicitly marked as not needing a company', () => {
    const guard = new CompanyScopeGuard(reflectorOf(true));

    expect(
      guard.canActivate(
        contextOf({
          headers: {},
          actor: { userId: 'u1', companyId: null, role: null },
        }),
      ),
    ).toBe(true);
  });
});
