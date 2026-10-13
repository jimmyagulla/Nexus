/** View models of the payslips screens, produced by their presenters. */

import type { StatusViewModel } from '../display.view-models';

export interface PayslipViewModel {
  fileName: string;
  zoom: string;
  pages: string;
  title: string;
  period: string;
  availableOn: string;
  issuer: string;
  size: string;
  netPay: string;
  previous?: { id: string; label: string };
  /** Following month, shown disabled when not yet available. */
  next: { id?: string; label: string };
  downloadedFileName?: string;
}

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
