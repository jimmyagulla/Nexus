import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useOpenExpenseReport } from './useOpenExpenseReport';

const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };

function renderQuery(http: InMemoryHttpClient) {
  const sessions = new InMemorySessionGateway('token', employer);
  const deps = {
    reports: createExpenseReportsComposition(http, sessions),
    categories: createExpenseCategoriesComposition(http, sessions),
  };
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useOpenExpenseReport('r1', deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useOpenExpenseReport', () => {
  it('opens the report and presents it with its categories', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports/r1/opening', {
      status: 201,
      data: {
        id: 'r1',
        companyId: 'c1',
        employeeId: 'e1',
        label: 'Lyon',
        status: 'UNDER_REVIEW',
        total: 68,
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
      statusLabel: 'En cours de validation',
      decidable: true,
    });
  });

  it('surfaces the refusal of the api', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/opening',
      new Error(ErrorCode.ACCESS_DENIED),
    );

    const { result } = renderQuery(http);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
