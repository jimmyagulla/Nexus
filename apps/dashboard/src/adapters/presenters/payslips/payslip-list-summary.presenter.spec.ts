import { PayslipList, PayslipSummary } from '@hexagonal-monorepo-template/domain';
import { CountLabelPresenter } from '../documents/count-label.presenter';
import { PayslipListSummaryPresenter } from './payslip-list-summary.presenter';

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

describe('PayslipListSummaryPresenter', () => {
  const presenter = new PayslipListSummaryPresenter(new CountLabelPresenter());

  it('counts every payslip of the vault', () => {
    expect(presenter.present(listOf(9, 67, [2026]))).toEqual({
      summary: "67 bulletins conservés dans votre coffre jusqu'à vos 75 ans.",
      emptyMessage: 'Aucun bulletin pour cette année.',
    });
  });

  it('says when the vault is still empty', () => {
    expect(presenter.present(listOf(0, 0, [])).summary).toBe('Aucun bulletin dans votre coffre pour le moment.');
  });
});
