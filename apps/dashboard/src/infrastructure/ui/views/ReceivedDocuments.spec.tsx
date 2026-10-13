import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ExchangeFilters } from '@hexagonal-monorepo-template/domain';
import type { CabinetExchangeViewModel } from '../../../adapters/presenters/cabinet-exchange.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { ReceivedDocuments } from './ReceivedDocuments';

const received: CabinetExchangeViewModel = {
  id: 'ex-1',
  category: 'Facture',
  fileName: 'releve.pdf',
  direction: 'Entreprise vers cabinet',
  status: 'Reçu',
  date: '06/10/2026',
  consultedOn: null,
  canMarkToTransmit: false,
  canTransmit: false,
  canOpen: true,
};

function renderView(exchanges: CabinetExchangeViewModel[] = [received]) {
  const calls = {
    opened: [] as string[],
    deposits: 0,
    filtered: [] as ExchangeFilters[],
    resets: 0,
  };
  render(
    <ReceivedDocuments
      exchanges={exchanges}
      errorPresenter={new ErrorPresenter()}
      onOpen={(id) => calls.opened.push(id)}
      onDeposit={() => (calls.deposits += 1)}
      onFilter={(filters) => calls.filtered.push(filters)}
      onReset={() => (calls.resets += 1)}
    />,
  );
  return calls;
}

describe('ReceivedDocuments', () => {
  it('is titled after the received documents', () => {
    renderView();

    expect(
      screen.getByRole('heading', {
        name: i18n.messages.cabinet.receivedTitle,
      }),
    ).toBeTruthy();
  });

  it('lists what the cabinet received', () => {
    renderView();

    expect(screen.getByText('releve.pdf')).toBeTruthy();
  });

  it('relays the request to open a document', () => {
    const calls = renderView();

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.open }),
    );

    expect(calls.opened).toEqual(['ex-1']);
  });

  it('offers the cabinet to deposit a document', () => {
    const calls = renderView();

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.depositAction,
      }),
    );

    expect(calls.deposits).toBe(1);
  });

  it('offers no way to prepare or transmit a document', () => {
    renderView();

    expect(
      screen.queryByRole('button', { name: i18n.messages.cabinet.newDocument }),
    ).toBeNull();
  });

  it('filters by type, date and status, but not by direction', async () => {
    const calls = renderView();

    expect(
      screen.queryByLabelText(i18n.messages.cabinet.filters.direction),
    ).toBeNull();
    fireEvent.change(
      screen.getByLabelText(i18n.messages.cabinet.filters.status),
      { target: { value: 'RECEIVED' } },
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.filters.apply,
      }),
    );

    await waitFor(() =>
      expect(calls.filtered).toEqual([
        { category: null, from: null, to: null, direction: null, status: 'RECEIVED' },
      ]),
    );
  });

  it('lifts the filters on request', () => {
    const calls = renderView();

    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.cabinet.filters.reset,
      }),
    );

    expect(calls.resets).toBe(1);
  });

  it('says that no document matches the filters', () => {
    renderView([]);

    expect(screen.getByText(i18n.messages.cabinet.noMatch)).toBeTruthy();
  });

  it('never links a file named after an employee to that employee record', () => {
    renderView([{ ...received, fileName: 'bulletin-marie-martin.pdf' }]);

    expect(screen.getByText('bulletin-marie-martin.pdf')).toBeTruthy();
    expect(screen.queryAllByRole('link')).toEqual([]);
  });
});
