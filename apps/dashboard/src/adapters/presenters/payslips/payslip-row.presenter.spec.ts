import { PayslipSummary } from '@hexagonal-monorepo-template/domain';
import { PayslipRowPresenter } from './payslip-row.presenter';

const september: PayslipSummary = {
  id: 'p9', year: 2026, month: 9, employerName: 'Atelier Moreau', fileName: 'Bulletin_2026-09.pdf',
  format: 'PDF', sizeBytes: 217_088, availableAt: '2026-09-30T08:00:00.000Z',
};

describe('PayslipRowPresenter', () => {
  const presenter = new PayslipRowPresenter();

  it('presents a payslip not opened yet as a new row of the table', () => {
    expect(presenter.present(september, false)).toEqual({
      id: 'p9',
      period: 'Septembre 2026',
      availableOn: '30/09/2026',
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
