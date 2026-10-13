import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { NewExchangeDialog } from './NewExchangeDialog';
import type { NewExchangeValues } from './new-exchange.schema';

const pdf = new File(['x'], 'releve.pdf', { type: 'application/pdf' });

function renderDialog(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: NewExchangeValues[] = [];

  render(
    <NewExchangeDialog
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      onSubmit={async (values) => {
        submitted.push(values);
        return options.accepted ?? true;
      }}
    />,
  );

  return {
    submitted,
    open: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.cabinet.newDocument }),
      ),
    fillAndSave: () => {
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(dialog.getByLabelText(i18n.messages.cabinet.category), {
        target: { value: 'Facture' },
      });
      fireEvent.change(dialog.getByLabelText(i18n.messages.cabinet.file), {
        target: { files: [pdf] },
      });
      fireEvent.click(
        dialog.getByRole('button', { name: i18n.messages.cabinet.saveDraft }),
      );
    },
  };
}

describe('NewExchangeDialog', () => {
  it('keeps the form out of the way until the user asks for it', () => {
    renderDialog();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('offers a new document', () => {
    renderDialog();

    expect(
      screen.getByRole('button', { name: i18n.messages.cabinet.newDocument }),
    ).toBeTruthy();
  });

  it('shows the form, named for what it is for, once asked', () => {
    const { open } = renderDialog();

    open();

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(i18n.messages.cabinet.newDocumentTitle)).toBeTruthy();
  });

  it('closes itself once the draft is accepted', async () => {
    const { open, fillAndSave, submitted } = renderDialog();

    open();
    fillAndSave();

    await waitFor(() => expect(submitted).toHaveLength(1));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('stays open when the draft is refused', async () => {
    const { open, fillAndSave, submitted } = renderDialog({ accepted: false });

    open();
    fillAndSave();

    await waitFor(() => expect(submitted).toHaveLength(1));
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });
});
