import { Account } from '../entities/account';
import { ErrorCode } from '../errors/error-code';
import { AccountIdentifier } from '../value-objects/account-identifier';
import { requireCompanyAccount } from './require-company-account';

const founder = Account.inviteEmployer(
  'founder',
  'company-1',
  AccountIdentifier.parse('founder'),
  'invite-founder',
);

describe('requireCompanyAccount', () => {
  it('returns the account carrying the id', () => {
    expect(requireCompanyAccount([founder], 'founder')).toBe(founder);
  });

  it('refuses an id that no account of the company carries', () => {
    expect(() => requireCompanyAccount([founder], 'missing')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses any id when the company has no account', () => {
    expect(() => requireCompanyAccount([], 'founder')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
