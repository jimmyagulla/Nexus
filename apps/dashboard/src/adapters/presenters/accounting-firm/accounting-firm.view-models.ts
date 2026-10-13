/** View models of the accounting firm screens, produced by their presenters. */

import type { StatusViewModel } from '../display.view-models';

export interface AccountingFirmViewModel {
  firm: FirmConnectionModel;
  all: ExchangeRowModel[];
  sent: ExchangeRowModel[];
  received: ExchangeRowModel[];
  counts: { all: string; sent: string; received: string };
}

export interface AccountingFirmUploadViewModel {
  firmName: string;
  form: AccountingFirmUploadFormModel;
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
