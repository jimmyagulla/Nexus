import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { useAddExpenseCategory } from './useAddExpenseCategory';
import { useGetExpenseCategories } from './useGetExpenseCategories';

const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };

function renderHooks(http: InMemoryHttpClient) {
  const deps = createExpenseCategoriesComposition(
    http,
    new InMemorySessionGateway('token', employer),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(
    () => ({
      categories: useGetExpenseCategories(deps),
      add: useAddExpenseCategory(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

describe('useAddExpenseCategory', () => {
  it('hands the label to the controller and refreshes the categories', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: [],
    });
    http.reply('post', 'companies/c1/expense-categories', {
      status: 201,
      data: [],
    });
    const { result } = renderHooks(http);
    await waitFor(() => expect(result.current.categories.isSuccess).toBe(true));

    await act(async () => {
      await result.current.add.mutateAsync('Hôtel');
    });

    await waitFor(() =>
      expect(http.calls.filter((call) => call.method === 'get')).toHaveLength(2),
    );
    expect(http.calls.find((call) => call.method === 'post')?.data).toEqual({
      label: 'Hôtel',
    });
  });

  it('surfaces the refusal of a duplicate category', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: [],
    });
    http.reject(
      'post',
      'companies/c1/expense-categories',
      new Error(ErrorCode.POTENTIAL_DUPLICATE),
    );
    const { result } = renderHooks(http);

    await act(async () => {
      result.current.add.mutate('Train');
    });

    await waitFor(() => expect(result.current.add.isError).toBe(true));
  });
});
