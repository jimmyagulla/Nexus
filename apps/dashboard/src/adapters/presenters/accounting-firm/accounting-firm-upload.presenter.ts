import type { AccountingFirmUploadViewModel } from './accounting-firm.view-models';

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
