import { render, screen } from '@testing-library/react';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { CabinetExchangesEmpty } from './CabinetExchangesEmpty';

function renderEmpty() {
  render(
    <CabinetExchangesEmpty
      errorPresenter={new ErrorPresenter()}
      createError={null}
      onCreate={async () => true}
    />,
  );
}

describe('CabinetExchangesEmpty', () => {
  it('says that nothing was exchanged with the cabinet yet', () => {
    renderEmpty();

    expect(
      screen.getByText("Aucun document n'a encore été échangé avec le cabinet."),
    ).toBeTruthy();
  });

  it('offers the employer a new document', () => {
    renderEmpty();

    expect(
      screen.getByRole('button', { name: i18n.messages.cabinet.newDocument }),
    ).toBeTruthy();
  });

  it('is still titled after the accounting firm', () => {
    renderEmpty();

    expect(
      screen.getByRole('heading', { name: i18n.messages.cabinet.title }),
    ).toBeTruthy();
  });
});
