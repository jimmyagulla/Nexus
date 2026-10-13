import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeDirection } from '../entities/exchange-direction';
import { ExchangeStatus } from '../entities/exchange-status';
import { ErrorCode } from '../errors/error-code';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { filterExchanges } from './filter-exchanges';

const file = ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1]));
const day = (date: string) => new Date(`${date}T09:00:00.000Z`);

function sent(id: string, category: string, date: string): CabinetExchange {
  return CabinetExchange.draft(id, 'c1', 'user-1', day(date))
    .withCategory(ExchangeCategory.parse(category))
    .withDocument(file)
    .markToTransmit()
    .transmit('user-1', day(date))
    .receive(day(date));
}

function deposited(id: string, category: string, date: string): CabinetExchange {
  return CabinetExchange.deposit(
    id,
    'c1',
    'cab-1',
    ExchangeCategory.parse(category),
    file,
    day(date),
  ).receive(day(date));
}

const draft = CabinetExchange.draft('draft', 'c1', 'user-1', day('2026-10-02'));

const exchanges = [
  sent('invoice-oct', 'Facture', '2026-10-01'),
  sent('invoice-nov', 'Facture', '2026-11-01'),
  sent('payroll', 'Paie', '2026-10-15'),
  deposited('balance', 'Bilan', '2026-10-20'),
  draft,
];

const ids = (list: readonly CabinetExchange[]) => list.map((e) => e.id);

describe('filterExchanges', () => {
  it('keeps everything when no filter is given', () => {
    expect(ids(filterExchanges(exchanges, {}))).toEqual(ids(exchanges));
  });

  it('treats an empty filter like no filter', () => {
    expect(
      ids(
        filterExchanges(exchanges, {
          category: null,
          from: null,
          to: null,
          direction: null,
          status: null,
        }),
      ),
    ).toEqual(ids(exchanges));
  });

  it('filters by type of document, whatever the case', () => {
    expect(
      ids(filterExchanges(exchanges, { category: ' facture ' })),
    ).toEqual(['invoice-oct', 'invoice-nov']);
  });

  it('filters by date, bounds included', () => {
    expect(
      ids(
        filterExchanges(exchanges, { from: '2026-10-15', to: '2026-10-20' }),
      ),
    ).toEqual(['payroll', 'balance']);
  });

  it('filters from a date on', () => {
    expect(ids(filterExchanges(exchanges, { from: '2026-10-20' }))).toEqual([
      'invoice-nov',
      'balance',
    ]);
  });

  it('filters up to a date', () => {
    expect(ids(filterExchanges(exchanges, { to: '2026-10-01' }))).toEqual([
      'invoice-oct',
    ]);
  });

  it('filters by direction without ever mixing the two', () => {
    const toCabinet = filterExchanges(exchanges, {
      direction: ExchangeDirection.COMPANY_TO_CABINET,
    });
    const toCompany = filterExchanges(exchanges, {
      direction: ExchangeDirection.CABINET_TO_COMPANY,
    });

    expect(ids(toCabinet)).toEqual([
      'invoice-oct',
      'invoice-nov',
      'payroll',
      'draft',
    ]);
    expect(ids(toCompany)).toEqual(['balance']);
  });

  it('filters by status', () => {
    expect(
      ids(filterExchanges(exchanges, { status: ExchangeStatus.DRAFT })),
    ).toEqual(['draft']);
    expect(
      ids(filterExchanges(exchanges, { status: ExchangeStatus.RECEIVED })),
    ).toEqual(['invoice-oct', 'invoice-nov', 'payroll', 'balance']);
  });

  it('combines the filters', () => {
    expect(
      ids(
        filterExchanges(exchanges, {
          category: 'Facture',
          direction: ExchangeDirection.COMPANY_TO_CABINET,
          status: ExchangeStatus.RECEIVED,
          from: '2026-10-01',
          to: '2026-10-31',
        }),
      ),
    ).toEqual(['invoice-oct']);
  });

  it('finds nothing when nothing matches', () => {
    expect(filterExchanges(exchanges, { category: 'Inconnue' })).toEqual([]);
  });

  it('refuses a date that is not a calendar date', () => {
    expect(() => filterExchanges(exchanges, { from: '06/10/2026' })).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(() => filterExchanges(exchanges, { to: '2026-02-30' })).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
