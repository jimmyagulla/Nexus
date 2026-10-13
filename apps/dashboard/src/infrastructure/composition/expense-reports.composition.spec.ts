import { describe, expect, it } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseReportSnapshot,
  ExpenseReportStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../ui/i18n/i18n';
import { createExpenseReportsComposition } from './expense-reports.composition';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const report: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  expenses: [],
};

describe('createExpenseReportsComposition', () => {
  it('wires a controller that opens a report on the session company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports', {
      status: 201,
      data: report,
    });
    const deps = createExpenseReportsComposition(
      http,
      new InMemorySessionGateway('token', employee),
    );

    await expect(deps.controller.createReport('Déplacement Lyon')).resolves.toEqual(
      report,
    );
    expect(http.calls[0]?.config).toEqual({
      headers: { Authorization: 'Bearer token' },
    });
  });

  it('wires a controller that lists the reports of the session company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-reports', {
      status: 200,
      data: { canCreate: true, reports: [report] },
    });
    const deps = createExpenseReportsComposition(
      http,
      new InMemorySessionGateway('token', employee),
    );

    await expect(deps.controller.listReports()).resolves.toEqual({
      canCreate: true,
      reports: [report],
    });
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const http = new InMemoryHttpClient();
    const deps = createExpenseReportsComposition(
      http,
      new InMemorySessionGateway(null, null),
    );

    await expect(deps.controller.getReport('r1')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });

  it('provides the presenters alongside the controller', () => {
    const deps = createExpenseReportsComposition(
      new InMemoryHttpClient(),
      new InMemorySessionGateway(null, null),
    );

    expect(deps.presenter.present(report, []).statusLabel).toBe(
      i18n.messages.expenseReports.status.DRAFT,
    );
    expect(deps.errorPresenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });
});
