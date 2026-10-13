import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireCompanyEmployer } from './require-company-employer';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('requireCompanyEmployer', () => {
  it('lets the employer of the company through', () => {
    expect(() => requireCompanyEmployer(employer, 'c1')).not.toThrow();
  });

  it('refuses the employer of another company', () => {
    expect(() => requireCompanyEmployer(employer, 'c2')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an employee', () => {
    expect(() =>
      requireCompanyEmployer({ ...employer, role: UserRole.EMPLOYEE }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses the cabinet', () => {
    expect(() =>
      requireCompanyEmployer({ ...employer, role: UserRole.ACCOUNTANT }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor without role', () => {
    expect(() =>
      requireCompanyEmployer({ ...employer, role: null }, 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
