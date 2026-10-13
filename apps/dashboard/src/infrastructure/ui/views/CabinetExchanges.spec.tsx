import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ExchangeFilters } from '@hexagonal-monorepo-template/domain';
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
  consultedOn: null,
  canMarkToTransmit: true,
  canTransmit: false,
  canOpen: false,
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
  const opened: string[] = [];
  const filtered: ExchangeFilters[] = [];
  const state = { resets: 0 };

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
      onOpen={(id) => opened.push(id)}
      onFilter={(filters) => filtered.push(filters)}
      onReset={() => (state.resets += 1)}
    />,
  );

  return { marked, transmitted, opened, filtered, state };
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

  it('relays the request to open a received exchange', () => {
    const { opened } = renderView({
      exchanges: [
        { ...draft, canMarkToTransmit: false, status: 'Reçu', canOpen: true },
      ],
    });

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.open }),
    );

    expect(opened).toEqual(['ex-1']);
  });

  it('filters by type, date, direction and status', async () => {
    const { filtered } = renderView();

    fireEvent.change(
      screen.getByLabelText(i18n.messages.cabinet.filters.direction),
      { target: { value: 'CABINET_TO_COMPANY' } },
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.filters.apply,
      }),
    );

    await waitFor(() =>
      expect(filtered).toEqual([
        {
          category: null,
          from: null,
          to: null,
          direction: 'CABINET_TO_COMPANY',
          status: null,
        },
      ]),
    );
  });

  it('lifts the filters on request', () => {
    const { state } = renderView();

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.filters.reset,
      }),
    );

    expect(state.resets).toBe(1);
  });

  it('says that no exchange matches the filters', () => {
    renderView({ exchanges: [] });

    expect(screen.getByText(i18n.messages.cabinet.noMatch)).toBeTruthy();
  });
});
