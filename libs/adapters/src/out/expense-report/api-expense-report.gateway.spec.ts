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
