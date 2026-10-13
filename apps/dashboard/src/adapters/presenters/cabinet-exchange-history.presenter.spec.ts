import { describe, expect, it } from 'vitest';
import {
  ExchangeDirection,
  ExchangeEventKind,
  ExchangeHistoryEntry,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { CabinetExchangeHistoryPresenter } from './cabinet-exchange-history.presenter';

const transmitted: ExchangeHistoryEntry = {
  exchangeId: 'ex-1',
  kind: ExchangeEventKind.TRANSMITTED,
  actorRole: UserRole.EMPLOYER,
  occurredAt: '2026-10-06T10:05:00.000Z',
  documentCount: 1,
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  fileName: 'a.pdf',
};

const presenter = new CabinetExchangeHistoryPresenter();

describe('CabinetExchangeHistoryPresenter', () => {
  it('reads a transmission as who, what and when', () => {
    expect(presenter.present([transmitted])).toEqual([
      {
        key: 'ex-1-TRANSMITTED-2026-10-06T10:05:00.000Z-0',
        who: 'Employeur',
        phrase: 'Le document a été transmis au cabinet comptable.',
        when: '06/10/2026 10:05',
      },
    ]);
  });

  it('reads a grouped transmission with the number of documents', () => {
    const [entry] = presenter.present([{ ...transmitted, documentCount: 5 }]);

    expect(entry?.phrase).toBe(
      '5 documents ont été transmis au cabinet comptable.',
    );
  });

  it('reads a transmission by the cabinet as sent to the company', () => {
    const [single, grouped] = presenter.present([
      {
        ...transmitted,
        actorRole: UserRole.ACCOUNTANT,
        direction: ExchangeDirection.CABINET_TO_COMPANY,
      },
      {
        ...transmitted,
        actorRole: UserRole.ACCOUNTANT,
        direction: ExchangeDirection.CABINET_TO_COMPANY,
        documentCount: 3,
      },
    ]);

    expect(single).toMatchObject({
      who: 'Cabinet comptable',
      phrase: "Le document a été transmis à l'entreprise.",
    });
    expect(grouped?.phrase).toBe("3 documents ont été transmis à l'entreprise.");
  });

  it('reads a reception as automatic, by whoever is the recipient', () => {
    const [byCabinet, byCompany] = presenter.present([
      { ...transmitted, kind: ExchangeEventKind.RECEIVED, actorRole: null },
      {
        ...transmitted,
        kind: ExchangeEventKind.RECEIVED,
        actorRole: null,
        direction: ExchangeDirection.CABINET_TO_COMPANY,
      },
    ]);

    expect(byCabinet).toMatchObject({
      who: 'Automatique',
      phrase: 'Le document a été reçu par le cabinet comptable.',
    });
    expect(byCompany?.phrase).toBe("Le document a été reçu par l'entreprise.");
  });

  it('reads a consultation and a download by the recipient', () => {
    const [consulted, downloaded] = presenter.present([
      {
        ...transmitted,
        kind: ExchangeEventKind.CONSULTED,
        actorRole: UserRole.ACCOUNTANT,
      },
      {
        ...transmitted,
        kind: ExchangeEventKind.DOWNLOADED,
        actorRole: UserRole.ACCOUNTANT,
      },
    ]);

    expect(consulted?.phrase).toBe(
      'Le document a été consulté par le cabinet comptable.',
    );
    expect(downloaded?.phrase).toBe(
      'Le document a été téléchargé par le cabinet comptable.',
    );
  });

  it('reads a consultation by the company when the cabinet deposited the document', () => {
    const [consulted] = presenter.present([
      {
        ...transmitted,
        kind: ExchangeEventKind.CONSULTED,
        actorRole: UserRole.EMPLOYER,
        direction: ExchangeDirection.CABINET_TO_COMPANY,
      },
    ]);

    expect(consulted).toMatchObject({
      who: 'Employeur',
      phrase: "Le document a été consulté par l'entreprise.",
    });
  });

  it('keeps the order it is given and tells nothing for nothing', () => {
    expect(presenter.present([])).toEqual([]);
    expect(
      presenter
        .present([
          { ...transmitted, exchangeId: 'b' },
          { ...transmitted, exchangeId: 'a' },
        ])
        .map((entry) => entry.key.slice(0, 1)),
    ).toEqual(['b', 'a']);
  });
});
