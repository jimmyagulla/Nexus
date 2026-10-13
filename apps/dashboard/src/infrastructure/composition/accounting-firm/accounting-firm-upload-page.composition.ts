import { AccountingFirmUploadPresenter } from '../../../adapters/presenters/accounting-firm/accounting-firm-upload.presenter';

export type AccountingFirmUploadPageComposition = {
  presenter: AccountingFirmUploadPresenter;
};

export function createAccountingFirmUploadPageComposition(): AccountingFirmUploadPageComposition {
  return { presenter: new AccountingFirmUploadPresenter() };
}
