import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, vi } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useOpenReceipt } from './useOpenReceipt';

const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };

function renderMutation(http: InMemoryHttpClient) {
  const reports = createExpenseReportsComposition(
    http,
    new InMemorySessionGateway('token', employer),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useOpenReceipt('r1', reports), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useOpenReceipt', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reads the receipt and opens it in a new tab', async () => {
    vi.stubGlobal('URL', { createObjectURL: () => 'blob:receipt' });
    const opened: unknown[][] = [];
    vi.spyOn(window, 'open').mockImplementation((...args) => {
      opened.push(args);
      return null;
    });
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/expense-reports/r1/receipts/f1', {
      status: 200,
      data: {
        id: 'f1',
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGVsbG8=',
      },
    });
    const { result } = renderMutation(http);

    await act(async () => {
      await result.current.mutateAsync('f1');
    });

    expect(opened).toEqual([['blob:receipt', '_blank']]);
  });

  it('surfaces the refusal of the api', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'get',
      'companies/c1/expense-reports/r1/receipts/f1',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    const { result } = renderMutation(http);

    await act(async () => {
      result.current.mutate('f1');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
