import { fireEvent, render, screen } from '@testing-library/react';
import type { ExchangeHistoryEntryViewModel } from '../../../adapters/presenters/cabinet-exchange-history.presenter';
import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { i18n } from '../i18n/i18n';
import { ExchangeDetail } from './ExchangeDetail';

const consulted: CabinetExchangeViewModel = {
  id: 'ex-1',
  category: 'Facture',
  fileName: 'releve.pdf',
  direction: 'Entreprise vers cabinet',
  status: 'Consulté',
  date: '06/10/2026',
  consultedOn: '07/10/2026',
  canMarkToTransmit: false,
  canTransmit: false,
  canOpen: true,
};

function renderDetail(
  options: {
    exchange?: CabinetExchangeViewModel;
    downloadError?: string | null;
    history?: ExchangeHistoryEntryViewModel[];
  } = {},
) {
  const calls = { downloaded: 0, back: 0 };
  render(
    <ExchangeDetail
      exchange={options.exchange ?? consulted}
      downloadError={options.downloadError ?? null}
      history={options.history ?? []}
      onDownload={() => (calls.downloaded += 1)}
      onBack={() => (calls.back += 1)}
    />,
  );
  return calls;
}

describe('ExchangeDetail', () => {
  it('describes the exchange', () => {
    renderDetail();

    for (const text of [
      'Facture',
      'releve.pdf',
      'Entreprise vers cabinet',
      'Consulté',
      '06/10/2026',
    ]) {
      expect(screen.getAllByText(new RegExp(text)).length).toBeGreaterThan(0);
    }
  });

  it('gives the date of the first consultation', () => {
    renderDetail();

    expect(
      screen.getByText(`${i18n.messages.cabinet.consultedOn} 07/10/2026`),
    ).toBeTruthy();
  });

  it('says when the exchange was not consulted yet', () => {
    renderDetail({ exchange: { ...consulted, consultedOn: null } });

    expect(screen.getByText(i18n.messages.cabinet.notConsulted)).toBeTruthy();
  });

  it('lets the actor download the file', () => {
    const calls = renderDetail();

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.download }),
    );

    expect(calls.downloaded).toBe(1);
  });

  it('lets the actor go back to the list', () => {
    const calls = renderDetail();

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.back }),
    );

    expect(calls.back).toBe(1);
  });

  it('tells why the download was refused', () => {
    renderDetail({ downloadError: i18n.messages.errors.INACCESSIBLE_DOCUMENT });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.INACCESSIBLE_DOCUMENT,
    );
  });

  it('tells the history of the exchange', () => {
    renderDetail({
      history: [
        {
          key: 'a',
          who: 'Cabinet comptable',
          phrase: 'Le document a été consulté par le cabinet comptable.',
          when: '07/10/2026 08:00',
        },
      ],
    });

    expect(
      screen.getByText('Le document a été consulté par le cabinet comptable.'),
    ).toBeTruthy();
  });

  it('says that nothing was recorded when the history is empty', () => {
    renderDetail();

    expect(screen.getByText(i18n.messages.cabinet.historyEmpty)).toBeTruthy();
  });
});
