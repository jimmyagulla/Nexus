import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { CompanyNameForm } from './CompanyNameForm';

function renderForm(name = 'Acme', submissionError: string | null = null) {
  const submitted: string[] = [];

  render(
    <CompanyNameForm
      name={name}
      errorPresenter={new ErrorPresenter()}
      submissionError={submissionError}
      onSubmit={async (value) => {
        submitted.push(value);
      }}
    />,
  );

  return {
    submitted,
    field: screen.getByLabelText<HTMLInputElement>(i18n.messages.settings.name),
    save: () =>
      fireEvent.click(
        screen.getByRole('button', { name: i18n.messages.settings.saveName }),
      ),
  };
}

describe('CompanyNameForm', () => {
  it('starts on the name the company carries today', () => {
    const { field } = renderForm('Acme');

    expect(field.value).toBe('Acme');
  });

  it('hands the typed name to its caller', async () => {
    const { field, save, submitted } = renderForm();

    fireEvent.change(field, { target: { value: 'Nexus' } });
    save();

    await waitFor(() => expect(submitted).toEqual(['Nexus']));
  });

  it('drops the spaces surrounding the typed name', async () => {
    const { field, save, submitted } = renderForm();

    fireEvent.change(field, { target: { value: '  Nexus  ' } });
    save();

    await waitFor(() => expect(submitted).toEqual(['Nexus']));
  });

  it('stays quiet until the company name is submitted', () => {
    renderForm();

    expect(screen.queryByText(i18n.messages.errors.REQUIRED_INFORMATION)).toBeNull();
  });

  it('explains that an empty name is not enough', async () => {
    const { field, save } = renderForm();

    fireEvent.change(field, { target: { value: '' } });
    save();

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
  });

  it('refuses to submit an empty name', async () => {
    const { field, save, submitted } = renderForm();

    fireEvent.change(field, { target: { value: '' } });
    save();

    await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION);
    expect(submitted).toEqual([]);
  });

  it('refuses to submit a name made of spaces', async () => {
    const { field, save, submitted } = renderForm();

    fireEvent.change(field, { target: { value: '   ' } });
    save();

    await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION);
    expect(submitted).toEqual([]);
  });

  it('shows the refusal its caller reports, next to the name', async () => {
    renderForm('Acme', i18n.messages.errors.ACCESS_DENIED);

    expect(screen.getByRole('alert').textContent).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('reports nothing while its caller reports no refusal', () => {
    renderForm();

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('drops the complaint once the name is filled again', async () => {
    const { field, save } = renderForm();

    fireEvent.change(field, { target: { value: '' } });
    save();
    await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION);

    fireEvent.change(field, { target: { value: 'Nexus' } });

    await waitFor(() =>
      expect(screen.queryByText(i18n.messages.errors.REQUIRED_INFORMATION)).toBeNull(),
    );
  });
});
