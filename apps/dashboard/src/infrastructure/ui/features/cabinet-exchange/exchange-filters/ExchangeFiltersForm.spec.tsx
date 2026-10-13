import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ExchangeFilters } from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExchangeFiltersForm } from './ExchangeFiltersForm';

function renderForm(withDirection = true) {
  const applied: ExchangeFilters[] = [];
  const state = { resets: 0 };
  render(
    <ExchangeFiltersForm
      errorPresenter={new ErrorPresenter()}
      withDirection={withDirection}
      onFilter={(filters) => applied.push(filters)}
      onReset={() => (state.resets += 1)}
    />,
  );
  return { applied, state };
}

const labels = i18n.messages.cabinet.filters;

describe('ExchangeFiltersForm', () => {
  it('offers the type of document, the dates, the direction and the status', () => {
    renderForm();

    for (const label of [
      labels.category,
      labels.from,
      labels.to,
      labels.direction,
      labels.status,
    ]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
  });

  it('leaves the direction out when only one direction can exist', () => {
    renderForm(false);

    expect(screen.queryByLabelText(labels.direction)).toBeNull();
  });

  it('offers every status of an exchange, and only those', () => {
    renderForm();

    const options = Array.from(
      (screen.getByLabelText(labels.status) as HTMLSelectElement).options,
    ).map((option) => option.textContent);

    expect(options).toEqual([
      labels.all,
      'Brouillon',
      'À transmettre',
      'Transmis',
      'Reçu',
      'Consulté',
    ]);
  });

  it('offers the two directions', () => {
    renderForm();

    const options = Array.from(
      (screen.getByLabelText(labels.direction) as HTMLSelectElement).options,
    ).map((option) => option.textContent);

    expect(options).toEqual([
      labels.all,
      'Entreprise vers cabinet',
      'Cabinet vers entreprise',
    ]);
  });

  it('applies the chosen filters', async () => {
    const { applied } = renderForm();

    fireEvent.change(screen.getByLabelText(labels.category), {
      target: { value: 'Facture' },
    });
    fireEvent.change(screen.getByLabelText(labels.from), {
      target: { value: '2026-10-01' },
    });
    fireEvent.change(screen.getByLabelText(labels.direction), {
      target: { value: 'CABINET_TO_COMPANY' },
    });
    fireEvent.change(screen.getByLabelText(labels.status), {
      target: { value: 'RECEIVED' },
    });
    fireEvent.click(screen.getByRole('button', { name: labels.apply }));

    await waitFor(() =>
      expect(applied).toEqual([
        {
          category: 'Facture',
          from: '2026-10-01',
          to: null,
          direction: 'CABINET_TO_COMPANY',
          status: 'RECEIVED',
        },
      ]),
    );
  });

  it('applies no filter at all when nothing is chosen', async () => {
    const { applied } = renderForm();

    fireEvent.click(screen.getByRole('button', { name: labels.apply }));

    await waitFor(() =>
      expect(applied).toEqual([
        { category: null, from: null, to: null, direction: null, status: null },
      ]),
    );
  });

  it('empties the form and lifts the filters on reset', async () => {
    const { state } = renderForm();
    fireEvent.change(screen.getByLabelText(labels.category), {
      target: { value: 'Facture' },
    });

    fireEvent.click(screen.getByRole('button', { name: labels.reset }));

    expect(state.resets).toBe(1);
    await waitFor(() =>
      expect(
        (screen.getByLabelText(labels.category) as HTMLInputElement).value,
      ).toBe(''),
    );
  });
});
