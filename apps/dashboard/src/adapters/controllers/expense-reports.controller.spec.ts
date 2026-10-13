import { describe, expect, it } from 'vitest';
import {
  ExpenseDetailsInput,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { ExpenseReportsController } from './expense-reports.controller';

const report: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  expenses: [],
};

const list: ExpenseReportListSnapshot = { canCreate: true, reports: [report] };

const expense: ExpenseDetailsInput = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
};

function controller() {
  const created: string[] = [];
  const added: { reportId: string; expense: ExpenseDetailsInput }[] = [];
  const read: string[] = [];
  return {
    created,
    added,
    read,
    controller: new ExpenseReportsController(
      {
        execute: async (label) => {
          created.push(label);
          return report;
        },
      },
      {
        execute: async (input) => {
          added.push(input);
          return report;
        },
      },
      {
        execute: async (reportId) => {
          read.push(reportId);
          return report;
        },
      },
      { execute: async () => list },
    ),
  };
}

describe('ExpenseReportsController', () => {
  it('creates a report from its label', async () => {
    const { controller: subject, created } = controller();

    await expect(subject.createReport('Déplacement Lyon')).resolves.toEqual(
      report,
    );
    expect(created).toEqual(['Déplacement Lyon']);
  });

  it('adds an expense to a report', async () => {
    const { controller: subject, added } = controller();

    await expect(subject.addExpense('r1', expense)).resolves.toEqual(report);
    expect(added).toEqual([{ reportId: 'r1', expense }]);
  });

  it('reads a report', async () => {
    const { controller: subject, read } = controller();

    await expect(subject.getReport('r1')).resolves.toEqual(report);
    expect(read).toEqual(['r1']);
  });

  it('lists the reports', async () => {
    await expect(controller().controller.listReports()).resolves.toEqual(list);
  });
});
