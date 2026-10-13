import { AccountingFirmPresenter } from '../../../adapters/presenters/accounting-firm/accounting-firm.presenter';

export type AccountingFirmPageComposition = {
  presenter: AccountingFirmPresenter;
};

export function createAccountingFirmPageComposition(): AccountingFirmPageComposition {
  return { presenter: new AccountingFirmPresenter() };
}
