import { DepositConfirmationPresenter } from './deposit-confirmation.presenter';

describe('DepositConfirmationPresenter', () => {
  const presenter = new DepositConfirmationPresenter();

  it('confirms one or several documents', () => {
    expect(presenter.present(1)).toBe('Votre document a été transmis au service RH.');
    expect(presenter.present(3)).toBe('Vos 3 documents ont été transmis au service RH.');
  });
});
