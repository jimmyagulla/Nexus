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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class AccountingFirmUploadPresenter {
  constructor(private readonly placeholder: AccountingFirmUploadViewModel) {}

  present(): AccountingFirmUploadViewModel {
    return this.placeholder;
  }
}
