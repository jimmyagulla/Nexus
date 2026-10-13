import type { AccountingFirmViewModel } from './accounting-firm.view-models';

/**
 * Presents the accounting firm exchanges.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class AccountingFirmPresenter {
  constructor(private readonly placeholder: AccountingFirmViewModel) {}

  present(): AccountingFirmViewModel {
    return this.placeholder;
  }
}
