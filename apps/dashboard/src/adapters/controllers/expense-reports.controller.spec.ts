import { describe, expect, it } from 'vitest';
import {
  ExpenseDetailsInput,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  ReceiptDetailsInput,
} from '@hexagonal-monorepo-template/domain';
import { ExpenseReportsController } from './expense-reports.controller';

const report: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  total: 0,
  receipts: [],
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

const file = {
  id: 'f1',
  fileName: 'ticket.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([1, 2, 3]),
};

function controller() {
  const created: string[] = [];
  const added: { reportId: string; expense: ExpenseDetailsInput }[] = [];
  const read: string[] = [];
  const updated: {
    reportId: string;
    expenseId: string;
    expense: ExpenseDetailsInput;
  }[] = [];
  const removed: { reportId: string; expenseId: string }[] = [];
  const attached: { reportId: string; receipt: ReceiptDetailsInput }[] = [];
  const submitted: string[] = [];
  const opened: { reportId: string; receiptId: string }[] = [];
  return {
    opened,
    created,
    added,
    read,
    updated,
    removed,
    attached,
    submitted,
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
      {
        execute: async (input) => {
          updated.push(input);
          return report;
        },
      },
      {
        execute: async (input) => {
          removed.push(input);
          return report;
        },
      },
      {
        execute: async (input) => {
          attached.push(input);
          return report;
        },
      },
      {
        execute: async (reportId) => {
          submitted.push(reportId);
          return report;
        },
      },
      {
        execute: async (input) => {
          opened.push(input);
          return file;
        },
      },
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

  it('modifies an expense of a report', async () => {
    const { controller: subject, updated } = controller();

    await expect(subject.updateExpense('r1', 'x1', expense)).resolves.toEqual(
      report,
    );
    expect(updated).toEqual([{ reportId: 'r1', expenseId: 'x1', expense }]);
  });

  it('removes an expense from a report', async () => {
    const { controller: subject, removed } = controller();

    await expect(subject.removeExpense('r1', 'x1')).resolves.toEqual(report);
    expect(removed).toEqual([{ reportId: 'r1', expenseId: 'x1' }]);
  });

  it('attaches a receipt to a report', async () => {
    const { controller: subject, attached } = controller();
    const receipt: ReceiptDetailsInput = {
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
      expenseId: null,
    };

    await expect(subject.attachReceipt('r1', receipt)).resolves.toEqual(report);
    expect(attached).toEqual([{ reportId: 'r1', receipt }]);
  });

  it('reads the file of a receipt', async () => {
    const { controller: subject, opened } = controller();

    await expect(subject.getReceipt('r1', 'f1')).resolves.toEqual(file);
    expect(opened).toEqual([{ reportId: 'r1', receiptId: 'f1' }]);
  });

  it('submits a report', async () => {
    const { controller: subject, submitted } = controller();

    await expect(subject.submitReport('r1')).resolves.toEqual(report);
    expect(submitted).toEqual(['r1']);
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
