import { CabinetExchange } from '../entities/cabinet-exchange';
import { ExchangeDirection } from '../entities/exchange-direction';
import { ExchangeStatus } from '../entities/exchange-status';
import { ExchangeCategory } from '../value-objects/exchange-category';
import { ExchangeFile } from '../value-objects/exchange-file';
import { toCabinetExchangeSnapshot } from './to-cabinet-exchange-snapshot';

const created = new Date('2026-10-06T09:00:00.000Z');
const sent = new Date('2026-10-07T10:00:00.000Z');

function ready(): CabinetExchange {
  return CabinetExchange.draft('ex-1', 'c1', 'user-1', created)
    .withCategory(ExchangeCategory.parse('Facture'))
    .withDocument(ExchangeFile.of('a.pdf', 'application/pdf', new Uint8Array([1, 2])));
}

describe('toCabinetExchangeSnapshot', () => {
  it('describes a draft with the day it was created', () => {
    expect(toCabinetExchangeSnapshot(ready())).toEqual({
      id: 'ex-1',
      direction: ExchangeDirection.COMPANY_TO_CABINET,
      status: ExchangeStatus.DRAFT,
      category: 'Facture',
      document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
      senderId: 'user-1',
      date: '2026-10-06T09:00:00.000Z',
      consultedAt: null,
    });
  });

  it('dates a transmitted exchange by its transmission', () => {
    const transmitted = ready().markToTransmit().transmit('user-1', sent);

    expect(toCabinetExchangeSnapshot(transmitted).date).toBe(
      '2026-10-07T10:00:00.000Z',
    );
  });

  it('describes an exchange without category nor document', () => {
    const snapshot = toCabinetExchangeSnapshot(
      CabinetExchange.draft('ex-2', 'c1', 'user-1', created),
    );

    expect(snapshot.category).toBeNull();
    expect(snapshot.document).toBeNull();
  });

  it('gives the day of the first consultation once the recipient opened it', () => {
    const opened = ready()
      .markToTransmit()
      .transmit('user-1', sent)
      .receive(sent)
      .consult('cab-1', new Date('2026-10-08T07:00:00.000Z'))
      .consult('cab-1', new Date('2026-10-09T07:00:00.000Z'));

    expect(toCabinetExchangeSnapshot(opened).consultedAt).toBe(
      '2026-10-08T07:00:00.000Z',
    );
  });
});
