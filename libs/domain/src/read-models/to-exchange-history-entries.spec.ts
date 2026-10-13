import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeEventKind } from '../entities/exchange-event';
import { UserRole } from '../identity/user-role';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { toExchangeHistoryEntries } from './to-exchange-history-entries';

const sent = new Date('2026-10-06T10:00:00.000Z');
const opened = new Date('2026-10-07T08:00:00.000Z');

const file = ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1]));

function outgoing(): CabinetExchange {
  return CabinetExchange.draft('ex-1', 'c1', 'user-1', sent)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(file)
    .markToTransmit()
    .transmit('user-1', sent, 5)
    .receive(sent)
    .consult('cab-1', opened);
}

describe('toExchangeHistoryEntries', () => {
  it('tells who did what and when, for every step of the exchange', () => {
    expect(toExchangeHistoryEntries(outgoing())).toEqual([
      {
        exchangeId: 'ex-1',
        kind: ExchangeEventKind.TRANSMITTED,
        actorRole: UserRole.EMPLOYER,
        occurredAt: '2026-10-06T10:00:00.000Z',
        documentCount: 5,
        direction: 'COMPANY_TO_CABINET',
        fileName: 'a.pdf',
      },
      {
        exchangeId: 'ex-1',
        kind: ExchangeEventKind.RECEIVED,
        actorRole: null,
        occurredAt: '2026-10-06T10:00:00.000Z',
        documentCount: 1,
        direction: 'COMPANY_TO_CABINET',
        fileName: 'a.pdf',
      },
      {
        exchangeId: 'ex-1',
        kind: ExchangeEventKind.CONSULTED,
        actorRole: UserRole.ACCOUNTANT,
        occurredAt: '2026-10-07T08:00:00.000Z',
        documentCount: 1,
        direction: 'COMPANY_TO_CABINET',
        fileName: 'a.pdf',
      },
    ]);
  });

  it('attributes a deposit to the cabinet and its consultation to the company', () => {
    const deposit = CabinetExchange.deposit(
      'ex-2',
      'c1',
      'cab-1',
      ExchangeCategory.parse('Bilan'),
      file,
      sent,
    )
      .receive(sent)
      .download('user-1', opened);

    expect(
      toExchangeHistoryEntries(deposit).map((entry) => [
        entry.kind,
        entry.actorRole,
      ]),
    ).toEqual([
      [ExchangeEventKind.TRANSMITTED, UserRole.ACCOUNTANT],
      [ExchangeEventKind.RECEIVED, null],
      [ExchangeEventKind.DOWNLOADED, UserRole.EMPLOYER],
    ]);
  });

  it('has nothing to tell about an exchange that never left the company', () => {
    expect(
      toExchangeHistoryEntries(CabinetExchange.draft('ex-3', 'c1', 'u', sent)),
    ).toEqual([]);
  });

  it('names the file of the exchange, or none when it has no document yet', () => {
    const transmitted = outgoing();

    expect(toExchangeHistoryEntries(transmitted)[0]?.fileName).toBe('a.pdf');
  });
});
