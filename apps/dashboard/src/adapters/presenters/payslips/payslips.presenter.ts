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
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class PayslipsPresenter {
  present(payslips: PayslipsViewModel): PayslipsViewModel {
    return payslips;
  }
}
