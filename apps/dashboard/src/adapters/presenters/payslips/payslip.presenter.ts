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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class PayslipPresenter {
  constructor(private readonly placeholder: PayslipViewModel) {}

  present(): PayslipViewModel {
    return this.placeholder;
  }
}
