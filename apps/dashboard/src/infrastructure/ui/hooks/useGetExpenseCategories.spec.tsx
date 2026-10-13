import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { useGetExpenseCategories } from './useGetExpenseCategories';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

function renderQuery(http: InMemoryHttpClient) {
  const deps = createExpenseCategoriesComposition(
    http,
    new InMemorySessionGateway('token', employee),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useGetExpenseCategories(deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useGetExpenseCategories', () => {
  it('presents the categories of the company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: [{ id: 'restaurant', label: 'Restaurant' }],
    });

    const { result } = renderQuery(http);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([
      { id: 'restaurant', label: 'Restaurant' },
    ]);
  });

  it('surfaces the refusal of the api', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'get',
      'companies/c1/expense-categories',
      new Error(ErrorCode.ACCESS_DENIED),
    );

    const { result } = renderQuery(http);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
