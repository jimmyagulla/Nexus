import { describe, expect, it } from 'vitest';
import {
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiExpenseReportGateway } from './api-expense-report.gateway';

const report: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  total: 0,
  receipts: [],
  expenses: [
    {
      id: 'x1',
      date: '2026-10-05',
      categoryId: 'restaurant',
      amount: 45,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Déjeuner',
      assignment: 'Client Dupont',
    },
  ],
};

const expense: ExpenseDetailsInput = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
};

const authorized = { headers: { Authorization: 'Bearer token' } };

describe('ApiExpenseReportGateway', () => {
  it('opens a draft report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports', {
      status: 201,
      data: report,
    });

    await expect(
      new ApiExpenseReportGateway(http).create(
        'c1',
        'Déplacement Lyon',
        'token',
      ),
    ).resolves.toEqual(report);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/expense-reports',
        data: { label: 'Déplacement Lyon' },
        config: authorized,
      },
    ]);
  });

  it('reads a report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-reports/r1', {
      status: 200,
      data: report,
    });

    await expect(
      new ApiExpenseReportGateway(http).get('c1', 'r1', 'token'),
    ).resolves.toEqual(report);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/expense-reports/r1',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('lists the reports', async () => {
    const http = new InMemoryHttpClient();
    const list = { canCreate: true, reports: [report] };
    http.reply('get', 'companies/c1/expense-reports', {
      status: 200,
      data: list,
    });

    await expect(
      new ApiExpenseReportGateway(http).list('c1', 'token'),
    ).resolves.toEqual(list);
  });

  it('modifies an expense of a report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('patch', 'companies/c1/expense-reports/r1/expenses/x1', {
      status: 200,
      data: report,
    });

    await expect(
      new ApiExpenseReportGateway(http).updateExpense(
        'c1',
        'r1',
        'x1',
        expense,
        'token',
      ),
    ).resolves.toEqual(report);
    expect(http.calls).toEqual([
      {
        method: 'patch',
        url: 'companies/c1/expense-reports/r1/expenses/x1',
        data: expense,
        config: authorized,
      },
    ]);
  });

  it('removes an expense from a report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('delete', 'companies/c1/expense-reports/r1/expenses/x1', {
      status: 200,
      data: report,
    });

    await expect(
      new ApiExpenseReportGateway(http).removeExpense('c1', 'r1', 'x1', 'token'),
    ).resolves.toEqual(report);
    expect(http.calls).toEqual([
      {
        method: 'delete',
        url: 'companies/c1/expense-reports/r1/expenses/x1',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('sends a receipt with its content encoded in base64', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports/r1/receipts', {
      status: 201,
      data: report,
    });

    await expect(
      new ApiExpenseReportGateway(http).attachReceipt(
        'c1',
        'r1',
        {
          fileName: 'ticket.pdf',
          mimeType: 'application/pdf',
          content: new Uint8Array([72, 101, 108, 108, 111]),
          expenseId: 'x1',
        },
        'token',
      ),
    ).resolves.toEqual(report);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/expense-reports/r1/receipts',
        data: {
          fileName: 'ticket.pdf',
          mimeType: 'application/pdf',
          contentBase64: 'SGVsbG8=',
          expenseId: 'x1',
        },
        config: authorized,
      },
    ]);
  });

  it('submits a report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports/r1/submission', {
      status: 201,
      data: report,
    });

    await expect(
      new ApiExpenseReportGateway(http).submit('c1', 'r1', 'token'),
    ).resolves.toEqual(report);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/expense-reports/r1/submission',
        data: undefined,
        config: authorized,
      },
    ]);
  });

  it('adds an expense to a report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports/r1/expenses', {
      status: 201,
      data: report,
    });

    await expect(
      new ApiExpenseReportGateway(http).addExpense('c1', 'r1', expense, 'token'),
    ).resolves.toEqual(report);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/expense-reports/r1/expenses',
        data: expense,
        config: authorized,
      },
    ]);
  });
});
