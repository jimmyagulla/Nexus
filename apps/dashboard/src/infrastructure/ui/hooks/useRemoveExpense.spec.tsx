import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useRemoveExpense } from './useRemoveExpense';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

function renderMutation(http: InMemoryHttpClient) {
  const reports = createExpenseReportsComposition(
    http,
    new InMemorySessionGateway('token', employee),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useRemoveExpense('r1', reports), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useRemoveExpense', () => {
  it('asks the controller to remove the expense', async () => {
    const http = new InMemoryHttpClient();
    http.reply('delete', 'companies/c1/expense-reports/r1/expenses/x3', {
      status: 200,
      data: {},
    });
    const { result } = renderMutation(http);

    await act(async () => {
      await result.current.mutateAsync('x3');
    });

    expect(http.calls[0]).toMatchObject({
      method: 'delete',
      url: 'companies/c1/expense-reports/r1/expenses/x3',
    });
  });

  it('surfaces the refusal of the api', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'delete',
      'companies/c1/expense-reports/r1/expenses/x3',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    const { result } = renderMutation(http);

    await act(async () => {
      result.current.mutate('x3');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
