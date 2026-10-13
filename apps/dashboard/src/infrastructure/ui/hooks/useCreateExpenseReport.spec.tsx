import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useCreateExpenseReport } from './useCreateExpenseReport';
import { useGetExpenseReports } from './useGetExpenseReports';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

function renderHooks(http: InMemoryHttpClient) {
  const sessions = new InMemorySessionGateway('token', employee);
  const reports = createExpenseReportsComposition(http, sessions);
  const categories = createExpenseCategoriesComposition(http, sessions);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(
    () => ({
      list: useGetExpenseReports({ reports, categories }),
      create: useCreateExpenseReport(reports),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
}

function httpWithEmptyList(): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-reports', {
    status: 200,
    data: { canCreate: true, reports: [] },
  });
  http.reply('get', 'companies/c1/expense-categories', {
    status: 200,
    data: [],
  });
  return http;
}

describe('useCreateExpenseReport', () => {
  it('hands the label to the controller and refreshes the list', async () => {
    const http = httpWithEmptyList();
    http.reply('post', 'companies/c1/expense-reports', {
      status: 201,
      data: {
        id: 'r1',
        companyId: 'c1',
        employeeId: 'e1',
        label: 'Lyon',
        status: 'DRAFT',
        expenses: [],
      },
    });
    const { result } = renderHooks(http);
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));

    await act(async () => {
      await result.current.create.mutateAsync('Lyon');
    });

    await waitFor(() =>
      expect(
        http.calls.filter(
          (call) =>
            call.method === 'get' && call.url === 'companies/c1/expense-reports',
        ),
      ).toHaveLength(2),
    );
    expect(http.calls.find((call) => call.method === 'post')?.data).toEqual({
      label: 'Lyon',
    });
  });

  it('surfaces the refusal for an inactive employee', async () => {
    const http = httpWithEmptyList();
    http.reject(
      'post',
      'companies/c1/expense-reports',
      new Error(ErrorCode.INACTIVE_EMPLOYEE),
    );
    const { result } = renderHooks(http);

    await act(async () => {
      result.current.create.mutate('Lyon');
    });

    await waitFor(() => expect(result.current.create.isError).toBe(true));
  });
});
