import { CabinetConnection } from '../entities/cabinet-connection';
import { CabinetConnectionStatus } from '../entities/cabinet-connection-status';
import { CabinetExchange } from '../entities/cabinet-exchange';
import { ActorContext } from '../identity/actor-context';
import { UserRole } from '../identity/user-role';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { isVisibleTo } from './exchange-visibility';

const at = new Date('2026-10-06T10:00:00.000Z');

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};
const otherEmployer: ActorContext = { ...employer, userId: 'user-2' };
const accountant: ActorContext = {
  userId: 'cab-1',
  companyId: 'c1',
  role: UserRole.ACCOUNTANT,
};
const employee: ActorContext = {
  userId: 'emp-1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const connected = new CabinetConnection('c1', CabinetConnectionStatus.CONNECTED);
const revoked = new CabinetConnection('c1', CabinetConnectionStatus.REVOKED);

function draft(): CabinetExchange {
  return CabinetExchange.draft('ex-1', 'c1', 'user-1', at)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1])));
}

describe('isVisibleTo', () => {
  it('shows a draft to its sender only', () => {
    expect(isVisibleTo(draft(), employer, connected)).toBe(true);
    expect(isVisibleTo(draft(), otherEmployer, connected)).toBe(false);
  });

  it('hides a draft from the cabinet', () => {
    expect(isVisibleTo(draft(), accountant, connected)).toBe(false);
  });

  it('hides an exchange still To transmit from the cabinet', () => {
    expect(isVisibleTo(draft().markToTransmit(), accountant, connected)).toBe(
      false,
    );
  });

  it('shows an exchange to the cabinet once it is Received', () => {
    const received = draft().markToTransmit().transmit('user-1', at).receive(at);

    expect(isVisibleTo(received, accountant, connected)).toBe(true);
  });

  it('hides a received exchange from a revoked cabinet', () => {
    const received = draft().markToTransmit().transmit('user-1', at).receive(at);

    expect(isVisibleTo(received, accountant, revoked)).toBe(false);
  });

  it('hides a received exchange from a cabinet that was never connected', () => {
    const received = draft().markToTransmit().transmit('user-1', at).receive(at);

    expect(isVisibleTo(received, accountant, null)).toBe(false);
  });

  it('hides the exchanges of another company', () => {
    const received = draft().markToTransmit().transmit('user-1', at).receive(at);
    const stranger: ActorContext = { ...accountant, companyId: 'c2' };

    expect(isVisibleTo(received, stranger, connected)).toBe(false);
  });

  it('hides every exchange from an employee', () => {
    const received = draft().markToTransmit().transmit('user-1', at).receive(at);

    expect(isVisibleTo(received, employee, connected)).toBe(false);
  });

  it('shows the employer the exchanges of the company once past the draft', () => {
    expect(
      isVisibleTo(draft().markToTransmit(), otherEmployer, connected),
    ).toBe(true);
  });

  describe('what the cabinet deposited', () => {
    const deposit = () =>
      CabinetExchange.deposit(
        'ex-2',
        'c1',
        'cab-1',
        ExchangeCategory.parse('Bilan'),
        ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1])),
        at,
      );

    it('stays out of sight of the company until it is Received', () => {
      expect(isVisibleTo(deposit(), employer, connected)).toBe(false);
      expect(isVisibleTo(deposit().receive(at), employer, connected)).toBe(true);
    });

    it('is shown to every employer of the company once Received', () => {
      expect(isVisibleTo(deposit().receive(at), otherEmployer, connected)).toBe(
        true,
      );
    });

    it('is not shown to an employer of another company', () => {
      expect(
        isVisibleTo(
          deposit().receive(at),
          { ...employer, companyId: 'c2' },
          connected,
        ),
      ).toBe(false);
    });

    it('is not listed among the documents the cabinet received', () => {
      expect(isVisibleTo(deposit().receive(at), accountant, connected)).toBe(
        false,
      );
    });
  });
});
