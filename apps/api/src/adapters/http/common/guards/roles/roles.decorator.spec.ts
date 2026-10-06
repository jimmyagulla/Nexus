import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { AuthenticatedRequest } from '../authenticated-request';

class EmployerRoutes {
  @Roles(UserRole.EMPLOYER)
  restricted(): void {
    return undefined;
  }

  open(): void {
    return undefined;
  }
}

@Roles(UserRole.ACCOUNTANT)
class AccountantRoutes {
  inherited(): void {
    return undefined;
  }
}

function contextOf(
  target: object,
  handler: () => void,
  request: AuthenticatedRequest,
): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => target,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function requestOf(role: UserRole): AuthenticatedRequest {
  return {
    headers: {},
    actor: { userId: 'user-1', companyId: 'company-1', role },
  };
}

const guard = new RolesGuard(new Reflector());

describe('Roles', () => {
  it('lets the declared role reach the handler', () => {
    const context = contextOf(
      EmployerRoutes,
      EmployerRoutes.prototype.restricted,
      requestOf(UserRole.EMPLOYER),
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('keeps another role away from the handler', () => {
    const context = contextOf(
      EmployerRoutes,
      EmployerRoutes.prototype.restricted,
      requestOf(UserRole.EMPLOYEE),
    );

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('leaves an undecorated handler open to every role', () => {
    const context = contextOf(
      EmployerRoutes,
      EmployerRoutes.prototype.open,
      requestOf(UserRole.EMPLOYEE),
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('applies to every handler when declared on the controller', () => {
    const accountant = contextOf(
      AccountantRoutes,
      AccountantRoutes.prototype.inherited,
      requestOf(UserRole.ACCOUNTANT),
    );
    const employer = contextOf(
      AccountantRoutes,
      AccountantRoutes.prototype.inherited,
      requestOf(UserRole.EMPLOYER),
    );

    expect(guard.canActivate(accountant)).toBe(true);
    expect(() => guard.canActivate(employer)).toThrow(ForbiddenException);
  });
});
