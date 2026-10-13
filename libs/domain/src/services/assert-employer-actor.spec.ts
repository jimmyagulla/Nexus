import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { assertEmployerActor } from './assert-employer-actor';

function actorWith(role: UserRole | null): ActorContext {
  return { userId: 'user-1', companyId: 'c1', role };
}

describe('assertEmployerActor', () => {
  it('lets an employer through', () => {
    expect(() => assertEmployerActor(actorWith(UserRole.EMPLOYER))).not.toThrow();
  });

  it('refuses an employee', () => {
    expect(() => assertEmployerActor(actorWith(UserRole.EMPLOYEE))).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an accountant', () => {
    expect(() => assertEmployerActor(actorWith(UserRole.ACCOUNTANT))).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an actor without role', () => {
    expect(() => assertEmployerActor(actorWith(null))).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
