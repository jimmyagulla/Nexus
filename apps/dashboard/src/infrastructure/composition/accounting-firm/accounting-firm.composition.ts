import {
  createAccountingFirmPageComposition,
  type AccountingFirmPageComposition,
} from './accounting-firm-page.composition';
import {
  createAccountingFirmUploadPageComposition,
  type AccountingFirmUploadPageComposition,
} from './accounting-firm-upload-page.composition';

/** Compositions of the accounting firm pages. */
export type AccountingFirmComposition = {
  accountingFirm: AccountingFirmPageComposition;
  accountingFirmUpload: AccountingFirmUploadPageComposition;
};

export function createAccountingFirmComposition(): AccountingFirmComposition {
  return {
    accountingFirm: createAccountingFirmPageComposition(),
    accountingFirmUpload: createAccountingFirmUploadPageComposition(),
  };
}
