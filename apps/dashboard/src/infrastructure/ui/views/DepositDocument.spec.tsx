import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { DepositDocument } from './DepositDocument';

const pdf = new File(['x'], 'bilan.pdf', { type: 'application/pdf' });

function renderView(
  options: { error?: string | null; confirmation?: string | null } = {},
) {
  const deposited: { category: string; file: File }[] = [];
  render(
    <DepositDocument
      errorPresenter={new ErrorPresenter()}
      depositError={options.error ?? null}
      confirmation={options.confirmation ?? null}
      onDeposit={async (values) => {
        deposited.push(values);
        return true;
      }}
    />,
  );
  return deposited;
}

describe('DepositDocument', () => {
  it('is titled after the deposit', () => {
    renderView();

    expect(
      screen.getByRole('heading', { name: i18n.messages.cabinet.depositTitle }),
    ).toBeTruthy();
  });

  it('hands the category and the file to deposit', async () => {
    const deposited = renderView();

    fireEvent.change(screen.getByLabelText(i18n.messages.cabinet.category), {
      target: { value: 'Bilan' },
    });
    fireEvent.change(screen.getByLabelText(i18n.messages.cabinet.file), {
      target: { files: [pdf] },
    });
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.cabinet.deposit }),
    );

    await waitFor(() =>
      expect(deposited).toEqual([{ category: 'Bilan', file: pdf }]),
    );
  });

  it('tells why the deposit was refused', () => {
    renderView({ error: i18n.messages.errors.ACCESS_DENIED });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('confirms the deposit', () => {
    renderView({ confirmation: i18n.messages.cabinet.deposited });

    expect(screen.getByRole('status').textContent).toBe(
      i18n.messages.cabinet.deposited,
    );
  });
});
