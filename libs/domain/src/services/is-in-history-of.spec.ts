import { CabinetConnection } from '../entities/cabinet-connection';
import { CabinetConnectionStatus } from '../entities/cabinet-connection-status';
import { CabinetExchange } from '../entities/cabinet-exchange';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { isInHistoryOf } from './is-in-history-of';

const at = new Date('2026-10-06T10:00:00.000Z');
const file = ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1]));

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};
const accountant: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};
const connected = new CabinetConnection('c1', CabinetConnectionStatus.CONNECTED);
const revoked = new CabinetConnection('c1', CabinetConnectionStatus.REVOKED);

function received(): CabinetExchange {
  return CabinetExchange.draft('ex-1', 'c1', 'user-1', at)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(file)
    .markToTransmit()
    .transmit('user-1', at)
    .receive(at);
}

function deposit(): CabinetExchange {
  return CabinetExchange.deposit(
    'ex-2',
    'c1',
    'cab-1',
    ExchangeCategory.parse('Bilan'),
    file,
    at,
  ).receive(at);
}

describe('isInHistoryOf', () => {
  it('keeps in the history of the employer what the employer can see', () => {
    expect(isInHistoryOf(received(), employer, connected)).toBe(true);
    expect(isInHistoryOf(deposit(), employer, connected)).toBe(true);
  });

  it('keeps in the history of the cabinet what it received and what it deposited', () => {
    expect(isInHistoryOf(received(), accountant, connected)).toBe(true);
    expect(isInHistoryOf(deposit(), accountant, connected)).toBe(true);
  });

  it('keeps nothing in the history of a revoked cabinet', () => {
    expect(isInHistoryOf(received(), accountant, revoked)).toBe(false);
    expect(isInHistoryOf(deposit(), accountant, revoked)).toBe(false);
  });

  it('keeps out of the history what the cabinet cannot see yet', () => {
    const toTransmit = CabinetExchange.draft('ex-3', 'c1', 'user-1', at)
      .withCategory(ExchangeCategory.parse('Facture'))
      .withDocument(file)
      .markToTransmit();

    expect(isInHistoryOf(toTransmit, accountant, connected)).toBe(false);
  });

  it('keeps out of the history the exchanges of another company', () => {
    expect(
      isInHistoryOf(received(), { ...accountant, companyId: 'c2' }, connected),
    ).toBe(false);
  });

  it('keeps nothing in the history of an employee', () => {
    expect(
      isInHistoryOf(received(), { ...employer, role: UserRole.EMPLOYEE }, connected),
    ).toBe(false);
  });
});
