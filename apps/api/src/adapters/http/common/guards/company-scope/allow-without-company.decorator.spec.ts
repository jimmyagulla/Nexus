import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { ActorContext } from '@hexagonal-monorepo-template/domain';
import { AllowWithoutCompany } from './allow-without-company.decorator';
import { CompanyScopeGuard } from './company-scope.guard';
import { AuthenticatedRequest } from '../authenticated-request';

class CompanyRoutes {
  @AllowWithoutCompany()
  create(): void {
    return undefined;
  }

  scoped(): void {
    return undefined;
  }
}

const unboundActor: ActorContext = {
  userId: 'user-1',
  companyId: null,
  role: null,
};

function contextOf(handler: () => void): ExecutionContext {
  const request: AuthenticatedRequest = { headers: {}, actor: unboundActor };

  return {
    getHandler: () => handler,
    getClass: () => CompanyRoutes,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

const guard = new CompanyScopeGuard(new Reflector());

describe('AllowWithoutCompany', () => {
  it('lets an actor bound to no company reach the decorated handler', () => {
    expect(guard.canActivate(contextOf(CompanyRoutes.prototype.create))).toBe(
      true,
    );
  });

  it('keeps the company scope required on an undecorated handler', () => {
    expect(() =>
      guard.canActivate(contextOf(CompanyRoutes.prototype.scoped)),
    ).toThrow(ForbiddenException);
  });
});
