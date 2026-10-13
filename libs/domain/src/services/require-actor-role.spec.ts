import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireActorRole } from './require-actor-role';

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

describe('requireActorRole', () => {
  it('lets an actor holding the role through', () => {
    expect(() => requireActorRole(employee, UserRole.EMPLOYEE)).not.toThrow();
  });

  it('refuses an actor holding another role', () => {
    expect(() => requireActorRole(employee, UserRole.EMPLOYER)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('lets an actor holding any of the roles through', () => {
    expect(() =>
      requireActorRole(employee, UserRole.EMPLOYER, UserRole.EMPLOYEE),
    ).not.toThrow();
  });

  it('refuses an actor without a role', () => {
    expect(() =>
      requireActorRole({ ...employee, role: null }, UserRole.EMPLOYEE),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
