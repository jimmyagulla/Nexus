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
  consultedAt: null,
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
        consultedOn: null,
        canMarkToTransmit: true,
        canTransmit: false,
        canOpen: false,
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

  it('lets the actor open an exchange once it is received or consulted', () => {
    const [received, consulted, draftOnly] = presenter.present([
      { ...draft, status: ExchangeStatus.RECEIVED },
      { ...draft, status: ExchangeStatus.CONSULTED },
      draft,
    ]);

    expect(received?.canOpen).toBe(true);
    expect(consulted?.canOpen).toBe(true);
    expect(draftOnly?.canOpen).toBe(false);
  });

  it('dates the first consultation', () => {
    const [consulted] = presenter.present([
      {
        ...draft,
        status: ExchangeStatus.CONSULTED,
        consultedAt: '2026-10-08T07:00:00.000Z',
      },
    ]);

    expect(consulted?.consultedOn).toBe('08/10/2026');
  });

  it('words the statuses of an exchange, and never one of the vault or of the expenses', () => {
    const labels = Object.values(ExchangeStatus).map(
      (status) => presenter.present([{ ...draft, status }])[0]?.status,
    );

    expect(labels).toEqual([
      'Brouillon',
      'À transmettre',
      'Transmis',
      'Reçu',
      'Consulté',
    ]);
    expect(labels).not.toContain('Archivé');
    expect(labels).not.toContain('Remboursée');
  });

  it('only offers the next step the reference allows', () => {
    const offered = Object.values(ExchangeStatus).map((status) => {
      const [exchange] = presenter.present([{ ...draft, status }]);
      return [status, exchange?.canMarkToTransmit, exchange?.canTransmit];
    });

    expect(offered).toEqual([
      [ExchangeStatus.DRAFT, true, false],
      [ExchangeStatus.TO_TRANSMIT, false, true],
      [ExchangeStatus.TRANSMITTED, false, false],
      [ExchangeStatus.RECEIVED, false, false],
      [ExchangeStatus.CONSULTED, false, false],
    ]);
  });
});
