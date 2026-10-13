import { AccountingFirmUploadPresenter } from '../../adapters/presenters/accounting-firm/accounting-firm-upload.presenter';

export type AccountingFirmUploadComposition = {
  presenter: AccountingFirmUploadPresenter;
};

export function createAccountingFirmUploadComposition(): AccountingFirmUploadComposition {
  return { presenter: new AccountingFirmUploadPresenter() };
}
