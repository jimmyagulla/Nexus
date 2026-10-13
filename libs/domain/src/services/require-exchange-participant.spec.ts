import { ErrorCode } from '../errors/error-code';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { requireExchangeParticipant } from './require-exchange-participant';

const actor = (role: UserRole | null, companyId: string | null = 'c1'): ActorContext => ({
  userId: 'u',
  companyId,
  role,
});

describe('requireExchangeParticipant', () => {
  it('lets the employer of the company through', () => {
    expect(() =>
      requireExchangeParticipant(actor(UserRole.EMPLOYER), 'c1'),
    ).not.toThrow();
  });

  it('lets the cabinet of the company through', () => {
    expect(() =>
      requireExchangeParticipant(actor(UserRole.ACCOUNTANT), 'c1'),
    ).not.toThrow();
  });

  it('refuses an employee, who has no part in the exchanges', () => {
    expect(() =>
      requireExchangeParticipant(actor(UserRole.EMPLOYEE), 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor without role', () => {
    expect(() => requireExchangeParticipant(actor(null), 'c1')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses the cabinet of another company', () => {
    expect(() =>
      requireExchangeParticipant(actor(UserRole.ACCOUNTANT, 'c2'), 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor without company', () => {
    expect(() =>
      requireExchangeParticipant(actor(UserRole.ACCOUNTANT, null), 'c1'),
    ).toThrow(ErrorCode.ACCESS_DENIED);
  });
});
