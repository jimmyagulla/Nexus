import { ErrorCode } from '../errors/error-code';
import { UserRole } from '../identity/user-role';
import { assertCompanyCreationAllowed } from './assert-company-creation-allowed';

const founder = {
  userId: 'user-1',
  companyId: null,
  role: null,
};

describe('assertCompanyCreationAllowed', () => {
  it('allows an actor not bound to any company', () => {
    expect(() => assertCompanyCreationAllowed(founder)).not.toThrow();
  });

  it('refuses an actor already bound to a company', () => {
    expect(() =>
      assertCompanyCreationAllowed({
        ...founder,
        companyId: 'company-a',
        role: UserRole.EMPLOYER,
      }),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
