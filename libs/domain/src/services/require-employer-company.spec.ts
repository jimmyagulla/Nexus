import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireEmployerCompany } from './require-employer-company';

const employer: ActorContext = {
  userId: 'founder',
  companyId: 'company-1',
  role: UserRole.EMPLOYER,
};

describe('requireEmployerCompany', () => {
  it('returns the company of an employer', () => {
    expect(requireEmployerCompany(employer)).toBe('company-1');
  });

  it('refuses an employee', () => {
    expect(() =>
      requireEmployerCompany({ ...employer, role: UserRole.EMPLOYEE }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an accountant', () => {
    expect(() =>
      requireEmployerCompany({ ...employer, role: UserRole.ACCOUNTANT }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor without a role', () => {
    expect(() => requireEmployerCompany({ ...employer, role: null })).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an actor without a company', () => {
    expect(() =>
      requireEmployerCompany({ ...employer, companyId: null }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
