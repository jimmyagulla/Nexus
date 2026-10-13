import { AccountingFirmPresenter } from '../../adapters/presenters/accounting-firm/accounting-firm.presenter';
import { AccountingFirmUploadPresenter } from '../../adapters/presenters/accounting-firm/accounting-firm-upload.presenter';
import { accountingFirmFixture, accountingFirmUploadFixture } from '../ui/fixtures/accounting-firm.fixture';

export type AccountingFirmComposition = {
  accountingFirmPresenter: AccountingFirmPresenter;
  accountingFirmUploadPresenter: AccountingFirmUploadPresenter;
};

/** Presenters of the accounting firm screens, fed with placeholder data for now. */
export function createAccountingFirmComposition(): AccountingFirmComposition {
  return {
    accountingFirmPresenter: new AccountingFirmPresenter(accountingFirmFixture),
    accountingFirmUploadPresenter: new AccountingFirmUploadPresenter(accountingFirmUploadFixture),
  };
}
