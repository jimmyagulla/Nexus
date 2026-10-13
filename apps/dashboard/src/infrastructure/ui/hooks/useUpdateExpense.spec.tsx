import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ErrorCode,
  ExpenseDetailsInput,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useUpdateExpense } from './useUpdateExpense';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

const expense: ExpenseDetailsInput = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 50,
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
};

function renderMutation(http: InMemoryHttpClient) {
  const reports = createExpenseReportsComposition(
    http,
    new InMemorySessionGateway('token', employee),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useUpdateExpense('r1', reports), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useUpdateExpense', () => {
  it('hands the modified expense to the controller', async () => {
    const http = new InMemoryHttpClient();
    http.reply('patch', 'companies/c1/expense-reports/r1/expenses/x1', {
      status: 200,
      data: {},
    });
    const { result } = renderMutation(http);

    await act(async () => {
      await result.current.mutateAsync({ expenseId: 'x1', expense });
    });

    expect(http.calls[0]).toMatchObject({
      method: 'patch',
      url: 'companies/c1/expense-reports/r1/expenses/x1',
      data: expense,
    });
  });

  it('surfaces the refusal of a report that is no longer a draft', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'patch',
      'companies/c1/expense-reports/r1/expenses/x1',
      new Error(ErrorCode.REQUEST_ALREADY_PROCESSED),
    );
    const { result } = renderMutation(http);

    await act(async () => {
      result.current.mutate({ expenseId: 'x1', expense });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
