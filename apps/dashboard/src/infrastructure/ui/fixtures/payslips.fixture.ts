import type { PayslipViewModel } from '../views/payslips/Payslip';
import type { PayslipsViewModel } from '../views/payslips/Payslips';

const seen = { label: 'Consulté', tone: 'neutral' } as const;

/** Placeholder data of the payslips screens (mockup v3, P1.5, P1.6 and M.2). */
export const payslipsFixture: PayslipsViewModel = {
  summary: "67 bulletins conservés dans votre coffre jusqu'à vos 75 ans.",
  year: '2026',
  yearSummary: '9 bulletins en 2026',
  hasNextYear: false,
  payslips: [
    {
      id: '2026-09',
      period: 'Septembre 2026',
      availableOn: '30/09/2026',
      netPay: '2 184,37 €',
      status: { label: 'Nouveau', tone: 'info' },
      isNew: true,
    },
    { id: '2026-08', period: 'Août 2026', availableOn: '31/08/2026', netPay: '2 179,12 €', status: seen },
    { id: '2026-07', period: 'Juillet 2026', availableOn: '31/07/2026', netPay: '2 236,80 €', status: seen },
    { id: '2026-06', period: 'Juin 2026', availableOn: '30/06/2026', netPay: '2 184,37 €', status: seen },
    { id: '2026-05', period: 'Mai 2026', availableOn: '31/05/2026', netPay: '2 190,05 €', status: seen },
    { id: '2026-04', period: 'Avril 2026', availableOn: '30/04/2026', netPay: '2 184,37 €', status: seen },
    { id: '2026-03', period: 'Mars 2026', availableOn: '31/03/2026', netPay: '2 201,44 €', status: seen },
    { id: '2026-02', period: 'Février 2026', availableOn: '28/02/2026', netPay: '2 176,90 €', status: seen },
    { id: '2026-01', period: 'Janvier 2026', availableOn: '31/01/2026', netPay: '2 184,37 €', status: seen },
  ],
};

export const payslipFixture: PayslipViewModel = {
  fileName: 'Bulletin_2026-09_Martin_Camille.pdf',
  zoom: '100 %',
  pages: 'Page 1 / 1',
  title: 'Septembre 2026',
  period: '01/09 – 30/09/2026',
  availableOn: '30/09/2026',
  issuer: 'Service RH',
  size: 'PDF · 212 Ko',
  netPay: '2 184,37 €',
  previous: { id: '2026-08', label: 'Août 2026' },
  next: { label: 'Octobre 2026' },
  downloadedFileName: 'Bulletin_2026-09.pdf',
};
