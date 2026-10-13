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
import { useGetExpenseReports } from './useGetExpenseReports';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

function screenOver(http: InMemoryHttpClient) {
  const sessions = new InMemorySessionGateway('token', employee);
  return {
    reports: createExpenseReportsComposition(http, sessions),
    categories: createExpenseCategoriesComposition(http, sessions),
  };
}

function renderQuery(http: InMemoryHttpClient) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useGetExpenseReports(screenOver(http)), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useGetExpenseReports', () => {
  it('presents the reports with the name of their categories', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-reports', {
      status: 200,
      data: {
        canCreate: true,
        totalAmount: 45,
        reports: [
          {
            id: 'r1',
            companyId: 'c1',
            employeeId: 'e1',
            label: 'Lyon',
            status: ExpenseReportStatus.DRAFT,
            receipts: [],
            reimbursedAmount: null,
            expenses: [
              {
                id: 'x1',
                date: '2026-10-05',
                categoryId: 'restaurant',
                amount: 45,
                vat: null,
                paymentMethod: 'Carte',
                description: 'Déjeuner',
                assignment: 'Client',
              },
            ],
          },
        ],
      },
    });
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: [{ id: 'restaurant', label: 'Restaurant' }],
    });

    const { result } = renderQuery(http);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.canCreate).toBe(true);
    expect(result.current.data?.reports[0]?.expenses[0]?.category).toBe(
      'Restaurant',
    );
  });

  it('waits while the reports are being read', () => {
    const { result } = renderQuery(new InMemoryHttpClient());

    expect(result.current.isPending).toBe(true);
  });

  it('surfaces the refusal of the api', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'get',
      'companies/c1/expense-reports',
      new Error(ErrorCode.ACCESS_DENIED),
    );

    const { result } = renderQuery(http);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
