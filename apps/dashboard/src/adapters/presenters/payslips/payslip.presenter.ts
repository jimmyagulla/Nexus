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

/**
 * Presents one payslip.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class PayslipPresenter {
  present(payslip: PayslipViewModel): PayslipViewModel {
    return payslip;
  }
}
