import { PayslipList, PayslipSummary } from '@hexagonal-monorepo-template/domain';
import { CountLabelPresenter } from '../documents/count-label.presenter';
import { PayslipYearPresenter } from './payslip-year.presenter';

function itemOf(month: number): PayslipSummary {
  return {
    id: `p${month}`, year: 2026, month, employerName: 'Atelier Moreau', netPayCents: 200000, fileName: 'b.pdf',
    format: 'PDF', sizeBytes: 1, availableAt: '2026-01-31T08:00:00.000Z',
  };
}

const listOf = (count: number, total: number, years: number[]): PayslipList => ({
  items: Array.from({ length: count }, (_, index) => itemOf(index + 1)),
  total,
  years,
});

describe('PayslipYearPresenter', () => {
  const presenter = new PayslipYearPresenter(new CountLabelPresenter());

  it('presents the year shown, its count and the download of all its payslips', () => {
    expect(presenter.present(listOf(9, 33, [2024, 2025, 2026]), 2026)).toEqual({
      year: '2026',
      yearSummary: '9 bulletins en 2026',
      previousYear: 2025,
      nextYear: null,
      options: [
        { year: 2026, label: '2026', selected: true },
        { year: 2025, label: '2025', selected: false },
        { year: 2024, label: '2024', selected: false },
      ],
      downloadAllLabel: 'Tout télécharger (2026)',
      canDownloadAll: true,
    });
  });

  it('offers the year shown even without any payslip in it, and nothing to download', () => {
    expect(presenter.present(listOf(0, 1, [2024]), 2026)).toMatchObject({
      yearSummary: 'Aucun bulletin en 2026',
      previousYear: 2024,
      options: [{ year: 2026, selected: true }, { year: 2024, selected: false }],
      canDownloadAll: false,
    });
  });

  it('says one payslip in the singular', () => {
    expect(presenter.present(listOf(1, 1, [2026]), 2026).yearSummary).toBe('1 bulletin en 2026');
  });
});
