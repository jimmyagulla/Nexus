import { Account } from '../entities/account';
import { ErrorCode } from '../errors/error-code';
import { AccountStatus } from '../identity/account-status';
import { UserRole } from '../identity/user-role';
import { AccountIdentifier } from '../value-objects/account-identifier';
import { assertEmployerRemainsActive } from './assert-employer-remains-active';

function activeEmployer(id: string): Account {
  return Account.inviteEmployer(
    id,
    'company-1',
    AccountIdentifier.parse(id),
    `invite-${id}`,
  ).activate('hashed-secret');
}

describe('assertEmployerRemainsActive', () => {
  it('refuses to disable the only active employer', () => {
    const founder = activeEmployer('founder');

    expect(() => assertEmployerRemainsActive([founder], founder)).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('allows disabling an employer when another one stays active', () => {
    const founder = activeEmployer('founder');
    const partner = activeEmployer('partner');

    expect(() =>
      assertEmployerRemainsActive([founder, partner], founder),
    ).not.toThrow();
  });

  it('does not count an invited employer as active', () => {
    const founder = activeEmployer('founder');
    const invited = Account.inviteEmployer(
      'partner',
      'company-1',
      AccountIdentifier.parse('partner'),
      'invite-partner',
    );

    expect(() =>
      assertEmployerRemainsActive([founder, invited], founder),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('lets an account that is not an employer go whatever the employers', () => {
    const employee = new Account(
      'employee-1',
      'company-1',
      AccountIdentifier.parse('employee-1'),
      UserRole.EMPLOYEE,
      AccountStatus.ACTIVE,
      null,
      'hashed-secret',
    );

    expect(() => assertEmployerRemainsActive([employee], employee)).not.toThrow();
  });

  it('does not count a disabled employer as active', () => {
    const founder = activeEmployer('founder');
    const disabled = activeEmployer('partner').disable();

    expect(() =>
      assertEmployerRemainsActive([founder, disabled], founder),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
