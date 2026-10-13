import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { NewExchangeForm } from './NewExchangeForm';
import type { NewExchangeValues } from './new-exchange.schema';

const pdf = new File(['x'], 'releve.pdf', { type: 'application/pdf' });

function renderForm(
  options: { accepted?: boolean; submissionError?: string | null } = {},
) {
  const submitted: NewExchangeValues[] = [];

  render(
    <NewExchangeForm
      errorPresenter={new ErrorPresenter()}
      submissionError={options.submissionError ?? null}
      submitLabel={i18n.messages.cabinet.saveDraft}
      onSubmit={async (values) => {
        submitted.push(values);
        return options.accepted ?? true;
      }}
    />,
  );

  return {
    submitted,
    fill: (category: string, files: File[]) => {
      fireEvent.change(screen.getByLabelText(i18n.messages.cabinet.category), {
        target: { value: category },
      });
      fireEvent.change(screen.getByLabelText(i18n.messages.cabinet.file), {
        target: { files },
      });
    },
    submit: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.cabinet.saveDraft }),
      ),
  };
}

describe('NewExchangeForm', () => {
  it('asks for a category and a file', () => {
    renderForm();

    expect(screen.getByLabelText(i18n.messages.cabinet.category)).toBeTruthy();
    expect(screen.getByLabelText(i18n.messages.cabinet.file)).toBeTruthy();
  });

  it('only offers the formats the cabinet accepts', () => {
    renderForm();

    expect(
      screen.getByLabelText(i18n.messages.cabinet.file).getAttribute('accept'),
    ).toBe('application/pdf,image/jpeg,image/png');
  });

  it('hands the entered category and file to its caller', async () => {
    const { fill, submit, submitted } = renderForm();

    fill('Facture', [pdf]);
    submit();

    await waitFor(() =>
      expect(submitted).toEqual([{ category: 'Facture', file: pdf }]),
    );
  });

  it('asks for the category when it is blank', async () => {
    const { fill, submit, submitted } = renderForm();

    fill('  ', [pdf]);
    submit();

    await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION);
    expect(submitted).toEqual([]);
  });

  it('asks for the document when no file is chosen', async () => {
    const { fill, submit, submitted } = renderForm();

    fill('Facture', []);
    submit();

    await screen.findByText(i18n.messages.errors.MISSING_DOCUMENT);
    expect(submitted).toEqual([]);
  });

  it('refuses a file the cabinet cannot accept', async () => {
    const { fill, submit, submitted } = renderForm();

    fill('Facture', [new File(['x'], 'notes.txt', { type: 'text/plain' })]);
    submit();

    await screen.findByText(i18n.messages.errors.INVALID_FILE);
    expect(submitted).toEqual([]);
  });

  it('shows the refusal its caller reports', () => {
    renderForm({ submissionError: i18n.messages.errors.INVALID_FILE });

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.INVALID_FILE,
    );
  });

  it('empties the form once the draft is accepted', async () => {
    const { fill, submit, submitted } = renderForm();

    fill('Facture', [pdf]);
    submit();
    await waitFor(() => expect(submitted).toHaveLength(1));

    await waitFor(() =>
      expect(
        (
          screen.getByLabelText(
            i18n.messages.cabinet.category,
          ) as HTMLInputElement
        ).value,
      ).toBe(''),
    );
  });
});
