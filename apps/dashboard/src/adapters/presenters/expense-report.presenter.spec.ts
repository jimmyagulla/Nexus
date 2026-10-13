import { describe, expect, it } from 'vitest';
import {
  ExpenseReportSnapshot,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../../infrastructure/ui/i18n/i18n';
import { ExpenseReportPresenter } from './expense-report.presenter';

const categories = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'parking', label: 'Parking' },
];

function plain(text: string | null): string | null {
  return text === null ? null : text.replace(/\s/g, ' ');
}

const report: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  expenses: [
    {
      id: 'x1',
      date: '2026-10-05',
      categoryId: 'restaurant',
      amount: 45,
      vat: 7.5,
      paymentMethod: 'Carte',
      description: 'Déjeuner',
      assignment: 'Client Dupont',
    },
    {
      id: 'x2',
      date: '2026-10-06',
      categoryId: 'unknown-category',
      amount: 12,
      vat: null,
      paymentMethod: 'Espèces',
      description: 'Stationnement',
      assignment: 'Projet X',
    },
  ],
};

describe('ExpenseReportPresenter', () => {
  it('names the status of the report in french', () => {
    const model = new ExpenseReportPresenter().present(report, categories);

    expect(model.statusLabel).toBe(i18n.messages.expenseReports.status.DRAFT);
    expect(model.status).toBe(ExpenseReportStatus.DRAFT);
  });

  it('lets the employee edit a draft only', () => {
    const presenter = new ExpenseReportPresenter();

    expect(presenter.present(report, categories).editable).toBe(true);
    expect(
      presenter.present(
        { ...report, status: ExpenseReportStatus.SUBMITTED },
        categories,
      ).editable,
    ).toBe(false);
  });

  it('keeps the identity and the label of the report', () => {
    const model = new ExpenseReportPresenter().present(report, categories);

    expect([model.id, model.label]).toEqual(['r1', 'Déplacement Lyon']);
  });

  it('shows the date as day, month and year', () => {
    const [first] = new ExpenseReportPresenter().present(report, categories)
      .expenses;

    expect(first?.date).toBe('05/10/2026');
  });

  it('names the category of an expense', () => {
    const [first] = new ExpenseReportPresenter().present(report, categories)
      .expenses;

    expect(first?.category).toBe('Restaurant');
  });

  it('falls back to the category identity when the category is not offered any more', () => {
    const expenses = new ExpenseReportPresenter().present(report, categories)
      .expenses;

    expect(expenses[1]?.category).toBe('unknown-category');
  });

  it('writes the amounts in euros', () => {
    const [first, second] = new ExpenseReportPresenter().present(
      report,
      categories,
    ).expenses;

    expect(plain(first?.amount ?? null)).toBe('45 €');
    expect(plain(first?.vat ?? null)).toBe('7,50 €');
    expect(second?.vat).toBeNull();
  });

  it('keeps the payment method, the description and the assignment', () => {
    const [first] = new ExpenseReportPresenter().present(report, categories)
      .expenses;

    expect([first?.paymentMethod, first?.description, first?.assignment]).toEqual(
      ['Carte', 'Déjeuner', 'Client Dupont'],
    );
  });

  it('presents every report of a list and whether a report can be created', () => {
    const list = new ExpenseReportPresenter().presentList(
      { canCreate: false, reports: [report] },
      categories,
    );

    expect(list.canCreate).toBe(false);
    expect(list.reports.map((item) => item.id)).toEqual(['r1']);
  });
});
