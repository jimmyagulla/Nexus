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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class AccountingFirmPresenter {
  constructor(private readonly placeholder: AccountingFirmViewModel) {}

  present(): AccountingFirmViewModel {
    return this.placeholder;
  }
}
