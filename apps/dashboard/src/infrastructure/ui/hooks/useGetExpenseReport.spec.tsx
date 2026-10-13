import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ErrorCode,
  ExpenseReportStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useGetExpenseReport } from './useGetExpenseReport';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

function renderQuery(http: InMemoryHttpClient) {
  const sessions = new InMemorySessionGateway('token', employee);
  const deps = {
    reports: createExpenseReportsComposition(http, sessions),
    categories: createExpenseCategoriesComposition(http, sessions),
  };
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useGetExpenseReport('r1', deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useGetExpenseReport', () => {
  it('presents the report asked for', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-reports/r1', {
      status: 200,
      data: {
        id: 'r1',
        companyId: 'c1',
        employeeId: 'e1',
        label: 'Lyon',
        status: ExpenseReportStatus.DRAFT,
        receipts: [],
        reimbursedAmount: null,
        expenses: [],
      },
    });
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: [],
    });

    const { result } = renderQuery(http);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({
      id: 'r1',
      label: 'Lyon',
      statusLabel: 'Brouillon',
    });
  });

  it('surfaces the refusal of the api', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'get',
      'companies/c1/expense-reports/r1',
      new Error(ErrorCode.ACCESS_DENIED),
    );

    const { result } = renderQuery(http);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
