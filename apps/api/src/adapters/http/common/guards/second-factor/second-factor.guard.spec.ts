import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';
import { ActorContext, UserRole } from '@hexagonal-monorepo-template/domain';
import { AuthenticatedRequest } from '../authenticated-request';
import { AllowWithoutSecondFactor } from './allow-without-second-factor.decorator';
import { SecondFactorGuard } from './second-factor.guard';

class Routes {
  @AllowWithoutSecondFactor()
  enrol(): void {
    return undefined;
  }

  space(): void {
    return undefined;
  }
}

@AllowWithoutSecondFactor()
class OpenRoutes {
  anything(): void {
    return undefined;
  }
}

const guard = new SecondFactorGuard(new Reflector());

function contextOf(
  actor: ActorContext | undefined,
  handler: () => void = Routes.prototype.space,
  routes: unknown = Routes,
): ExecutionContext {
  const request: AuthenticatedRequest = { headers: {}, actor };
  return {
    getHandler: () => handler,
    getClass: () => routes,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

describe('SecondFactorGuard', () => {
  it('opens the space of an employee whose second factor is verified', () => {
    expect(
      guard.canActivate(contextOf({ ...employee, secondFactorVerified: true })),
    ).toBe(true);
  });

  it('keeps the space closed to an employee who gave the secret only', () => {
    expect(() => guard.canActivate(contextOf(employee))).toThrow(
      ForbiddenException,
    );
  });

  it('answers that the second factor is required', () => {
    expect(() => guard.canActivate(contextOf(employee))).toThrow(
      'SECOND_FACTOR_REQUIRED',
    );
  });

  it('keeps the space closed when the verification is explicitly false', () => {
    expect(() =>
      guard.canActivate(contextOf({ ...employee, secondFactorVerified: false })),
    ).toThrow(ForbiddenException);
  });

  it('lets an employee reach a route that leads to the second factor', () => {
    expect(
      guard.canActivate(contextOf(employee, Routes.prototype.enrol)),
    ).toBe(true);
  });

  it('lets an employee reach every route of a controller that leads to the second factor', () => {
    expect(
      guard.canActivate(
        contextOf(employee, OpenRoutes.prototype.anything, OpenRoutes),
      ),
    ).toBe(true);
  });

  it.each([UserRole.EMPLOYER, UserRole.ACCOUNTANT])(
    'lets a %s in without second factor',
    (role) => {
      expect(guard.canActivate(contextOf({ ...employee, role }))).toBe(true);
    },
  );

  it('lets a request without actor through, authentication refuses it elsewhere', () => {
    expect(guard.canActivate(contextOf(undefined))).toBe(true);
  });

  it('lets an actor without role through, the roles guard decides', () => {
    expect(guard.canActivate(contextOf({ ...employee, role: null }))).toBe(
      true,
    );
  });
});
