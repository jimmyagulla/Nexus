export interface AccountingFirmUploadViewModel {
  firmName: string;
  form: AccountingFirmUploadFormModel;
}

export interface AccountingFirmUploadFormModel {
  documentTypes: string[];
  documentType: string;
  recipients: string[];
  recipient: string;
  files: { icon: string; name: string; details: string }[];
  transmission: 'immediate' | 'scheduled';
  transmissionDate: string;
  comment: string;
}

/**
 * Presents the upload for the accounting firm.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class AccountingFirmUploadPresenter {
  present(accountingFirmUpload: AccountingFirmUploadViewModel): AccountingFirmUploadViewModel {
    return accountingFirmUpload;
  }
}
