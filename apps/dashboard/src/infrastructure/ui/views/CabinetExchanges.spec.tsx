import { fireEvent, render, screen, within } from '@testing-library/react';
import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { CabinetExchanges } from './CabinetExchanges';

const draft: CabinetExchangeViewModel = {
  id: 'ex-1',
  category: 'Facture',
  fileName: 'releve.pdf',
  direction: 'Entreprise vers cabinet',
  status: 'Brouillon',
  date: '06/10/2026',
  canMarkToTransmit: true,
  canTransmit: false,
};

function renderView(
  options: {
    exchanges?: CabinetExchangeViewModel[];
    actionError?: string | null;
    confirmation?: string | null;
  } = {},
) {
  const marked: string[] = [];
  const transmitted: string[] = [];

  render(
    <CabinetExchanges
      exchanges={options.exchanges ?? [draft]}
      errorPresenter={new ErrorPresenter()}
      createError={null}
      actionError={options.actionError ?? null}
      confirmation={options.confirmation ?? null}
      onCreate={async () => true}
      onMarkToTransmit={(id) => marked.push(id)}
      onTransmit={(id) => transmitted.push(id)}
    />,
  );

  return { marked, transmitted };
}

describe('CabinetExchanges', () => {
  it('is titled after the accounting firm', () => {
    renderView();

    expect(
      screen.getByRole('heading', { name: i18n.messages.cabinet.title }),
    ).toBeTruthy();
  });

  it('lists the exchanges', () => {
    renderView();

    expect(
      within(screen.getByRole('list')).getByText('releve.pdf'),
    ).toBeTruthy();
  });

  it('offers a new document', () => {
    renderView();

    expect(
      screen.getByRole('button', { name: i18n.messages.cabinet.newDocument }),
    ).toBeTruthy();
  });

  it('relays the request to mark an exchange as ready', () => {
    const { marked } = renderView();

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.markToTransmit,
      }),
    );

    expect(marked).toEqual(['ex-1']);
  });

  it('relays the request to transmit an exchange', () => {
    const { transmitted } = renderView({
      exchanges: [{ ...draft, canMarkToTransmit: false, canTransmit: true }],
    });

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.transmit }),
    );

    expect(transmitted).toEqual(['ex-1']);
  });

  it('tells why an action was refused', () => {
    renderView({ actionError: i18n.messages.errors.TRANSMISSION_FAILED });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.TRANSMISSION_FAILED,
    );
  });

  it('confirms what was done', () => {
    renderView({ confirmation: i18n.messages.cabinet.transmitted });

    expect(screen.getByRole('status').textContent).toBe(
      i18n.messages.cabinet.transmitted,
    );
  });
});
