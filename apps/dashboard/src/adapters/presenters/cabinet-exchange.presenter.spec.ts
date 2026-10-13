import { describe, expect, it } from 'vitest';
import {
  CabinetExchangeSnapshot,
  ExchangeDirection,
  ExchangeStatus,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../../infrastructure/ui/i18n/i18n';
import { CabinetExchangePresenter } from './cabinet-exchange.presenter';

const draft: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: { fileName: 'releve.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'user-1',
  date: '2026-10-06T09:00:00.000Z',
};

const presenter = new CabinetExchangePresenter();

describe('CabinetExchangePresenter', () => {
  it('presents an exchange in the words of the screen', () => {
    expect(presenter.present([draft])).toEqual([
      {
        id: 'ex-1',
        category: 'Facture',
        fileName: 'releve.pdf',
        direction: 'Entreprise vers cabinet',
        status: 'Brouillon',
        date: '06/10/2026',
        canMarkToTransmit: true,
        canTransmit: false,
      },
    ]);
  });

  it('keeps the order it is given', () => {
    const second = { ...draft, id: 'ex-2' };

    expect(
      presenter.present([second, draft]).map((exchange) => exchange.id),
    ).toEqual(['ex-2', 'ex-1']);
  });

  it('presents nothing for an empty list', () => {
    expect(presenter.present([])).toEqual([]);
  });

  it('offers to transmit an exchange that is ready, not to mark it again', () => {
    const [ready] = presenter.present([
      { ...draft, status: ExchangeStatus.TO_TRANSMIT },
    ]);

    expect(ready).toMatchObject({
      status: 'À transmettre',
      canMarkToTransmit: false,
      canTransmit: true,
    });
  });

  it.each([
    [ExchangeStatus.TRANSMITTED, 'Transmis'],
    [ExchangeStatus.RECEIVED, 'Reçu'],
    [ExchangeStatus.CONSULTED, 'Consulté'],
  ])('offers no action on an exchange that left the company (%s)', (status, label) => {
    const [sent] = presenter.present([{ ...draft, status }]);

    expect(sent).toMatchObject({
      status: label,
      canMarkToTransmit: false,
      canTransmit: false,
    });
  });

  it('says so when an exchange has no category nor file yet', () => {
    const [empty] = presenter.present([
      { ...draft, category: null, document: null },
    ]);

    expect(empty).toMatchObject({
      category: i18n.messages.cabinet.noCategory,
      fileName: i18n.messages.cabinet.noFile,
    });
  });

  it('names the direction a document travels', () => {
    const [incoming] = presenter.present([
      { ...draft, direction: ExchangeDirection.CABINET_TO_COMPANY },
    ]);

    expect(incoming?.direction).toBe('Cabinet vers entreprise');
  });
});
