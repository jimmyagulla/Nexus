import type { PayslipViewModel } from '../../../adapters/presenters/payslips/payslip.presenter';

/** Placeholder data of the payslip screen (mockup v3, P1.6). */
export const payslipFixture: PayslipViewModel = {
  fileName: 'Bulletin_2026-09_Martin_Camille.pdf',
  zoom: '100 %',
  pages: 'Page 1 / 1',
  title: 'Septembre 2026',
  period: '01/09 – 30/09/2026',
  availableOn: '30/09/2026',
  issuer: 'Service RH',
  size: 'PDF · 212 Ko',
  previous: { id: '2026-08', label: 'Août 2026' },
  next: { label: 'Octobre 2026' },
  downloadedFileName: 'Bulletin_2026-09.pdf',
};
