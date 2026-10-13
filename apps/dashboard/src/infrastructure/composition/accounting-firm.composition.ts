import { AccountingFirmPresenter } from '../../adapters/presenters/accounting-firm/accounting-firm.presenter';

export type AccountingFirmComposition = {
  presenter: AccountingFirmPresenter;
};

export function createAccountingFirmComposition(): AccountingFirmComposition {
  return { presenter: new AccountingFirmPresenter() };
}
