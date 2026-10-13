import type { StatusViewModel } from '../display.types';

export interface AccountingFirmViewModel {
  firm: FirmConnectionModel;
  all: ExchangeRowModel[];
  sent: ExchangeRowModel[];
  received: ExchangeRowModel[];
  counts: { all: string; sent: string; received: string };
}

export interface ExchangeRowModel {
  id: string;
  icon: string;
  name: string;
  category: string;
  date: string;
  direction: 'toFirm' | 'fromFirm';
  status: StatusViewModel;
}

export interface FirmConnectionModel {
  name: string;
  contact: string;
}

/**
 * Presents the accounting firm exchanges.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class AccountingFirmPresenter {
  present(accountingFirm: AccountingFirmViewModel): AccountingFirmViewModel {
    return accountingFirm;
  }
}
