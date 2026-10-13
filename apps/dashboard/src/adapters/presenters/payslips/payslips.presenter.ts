import type { StatusViewModel } from '../display.types';

export interface PayslipsViewModel {
  summary: string;
  year: string;
  yearSummary: string;
  hasNextYear: boolean;
  payslips: PayslipRowModel[];
}

export interface PayslipRowModel {
  id: string;
  period: string;
  availableOn: string;
  netPay: string;
  status: StatusViewModel;
  isNew?: boolean;
}

/**
 * Presents the payslips list.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class PayslipsPresenter {
  constructor(private readonly placeholder: PayslipsViewModel) {}

  present(): PayslipsViewModel {
    return this.placeholder;
  }
}
