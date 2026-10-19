import { PayslipSummary } from '@hexagonal-monorepo-template/domain';
import { PayslipRowPresenter } from './payslip-row.presenter';

const september: PayslipSummary = {
  id: 'p9', year: 2026, month: 9, employerName: 'Atelier Moreau', netPayCents: 218437, fileName: 'Bulletin_2026-09.pdf',
  format: 'PDF', sizeBytes: 217_088, availableAt: '2026-09-30T08:00:00.000Z',
};

/** Intl separates thousands and the currency with no-break spaces. */
const plainSpaces = (text: string) => text.replace(/\s/g, ' ');

describe('PayslipRowPresenter', () => {
  const presenter = new PayslipRowPresenter();

  it('presents a payslip not opened yet as a new row of the table', () => {
    const row = presenter.present(september, false);

    expect({ ...row, netPay: plainSpaces(row.netPay) }).toEqual({
      id: 'p9',
      period: 'Septembre 2026',
      availableOn: '30/09/2026',
      netPay: '2 184,37 €',
      status: { label: 'Nouveau', tone: 'info' },
      isNew: true,
    });
  });

  it('presents a payslip already opened or downloaded as seen', () => {
    expect(presenter.present({ ...september, month: 2 }, true)).toMatchObject({
      period: 'Février 2026',
      status: { label: 'Consulté', tone: 'neutral' },
      isNew: false,
    });
  });
});
