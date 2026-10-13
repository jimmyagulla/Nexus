import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireEmployerOfCompany } from './require-employer-of-company';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('requireEmployerOfCompany', () => {
  it('lets the employer of the company through', () => {
    expect(() => requireEmployerOfCompany(employer, 'c1')).not.toThrow();
  });

  it('refuses the employer of another company', () => {
    expect(() => requireEmployerOfCompany(employer, 'c2')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an actor who has no company', () => {
    expect(() =>
      requireEmployerOfCompany({ ...employer, companyId: null }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor who has no role', () => {
    expect(() =>
      requireEmployerOfCompany({ ...employer, role: null }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an accountant', () => {
    expect(() =>
      requireEmployerOfCompany({ ...employer, role: UserRole.ACCOUNTANT }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employee of the company', () => {
    expect(() =>
      requireEmployerOfCompany({ ...employer, role: UserRole.EMPLOYEE }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
