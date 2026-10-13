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
import { useAddExpense } from './useAddExpense';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

const expense: ExpenseDetailsInput = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
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
  return renderHook(() => useAddExpense('r1', reports), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useAddExpense', () => {
  it('hands the expense to the controller for the report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports/r1/expenses', {
      status: 201,
      data: {},
    });
    const { result } = renderMutation(http);

    await act(async () => {
      await result.current.mutateAsync(expense);
    });

    expect(http.calls[0]).toMatchObject({
      method: 'post',
      url: 'companies/c1/expense-reports/r1/expenses',
      data: expense,
    });
  });

  it('surfaces the refusal of an invalid amount', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/expenses',
      new Error(ErrorCode.INVALID_AMOUNT),
    );
    const { result } = renderMutation(http);

    await act(async () => {
      result.current.mutate({ ...expense, amount: 0 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
