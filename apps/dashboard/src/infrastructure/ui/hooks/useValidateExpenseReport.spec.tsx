import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useValidateExpenseReport } from './useValidateExpenseReport';

const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };

function renderMutation(http: InMemoryHttpClient) {
  const reports = createExpenseReportsComposition(
    http,
    new InMemorySessionGateway('token', employer),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useValidateExpenseReport('r1', reports), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useValidateExpenseReport', () => {
  it('asks the controller to process the report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports/r1/validation', {
      status: 201,
      data: {},
    });
    const { result } = renderMutation(http);

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(http.calls[0]).toMatchObject({
      method: 'post',
      url: 'companies/c1/expense-reports/r1/validation',
    });
  });

  it('surfaces the refusal of a report already processed', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/validation',
      new Error(ErrorCode.REQUEST_ALREADY_PROCESSED),
    );
    const { result } = renderMutation(http);

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
