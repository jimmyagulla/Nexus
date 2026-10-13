import { CabinetExchange } from '../entities/cabinet-exchange';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { isRecipient } from './is-recipient';

const at = new Date('2026-10-06T10:00:00.000Z');
const exchange = CabinetExchange.draft('ex-1', 'c1', 'user-1', at);

const actor = (role: UserRole | null): ActorContext => ({
  userId: 'u',
  companyId: 'c1',
  role,
});

describe('isRecipient', () => {
  it('makes the cabinet the recipient of what the company sends', () => {
    expect(isRecipient(exchange, actor(UserRole.ACCOUNTANT))).toBe(true);
  });

  it('does not make the sender the recipient', () => {
    expect(isRecipient(exchange, actor(UserRole.EMPLOYER))).toBe(false);
  });

  it('never makes an employee or an unknown actor a recipient', () => {
    expect(isRecipient(exchange, actor(UserRole.EMPLOYEE))).toBe(false);
    expect(isRecipient(exchange, actor(null))).toBe(false);
  });
});
