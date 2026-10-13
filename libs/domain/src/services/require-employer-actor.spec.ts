import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireEmployerActor } from './require-employer-actor';

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('requireEmployerActor', () => {
  it('lets an employer act in her own company', () => {
    expect(() => requireEmployerActor(employer, 'c1')).not.toThrow();
  });

  it('refuses an employee', () => {
    expect(() =>
      requireEmployerActor({ ...employer, role: UserRole.EMPLOYEE }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses another company', () => {
    expect(() => requireEmployerActor(employer, 'c2')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
