import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { useAttachReceipt } from './useAttachReceipt';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

const receipt = {
  fileName: 'ticket.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([72, 101, 108, 108, 111]),
  expenseId: null,
};

function renderMutation(http: InMemoryHttpClient) {
  const reports = createExpenseReportsComposition(
    http,
    new InMemorySessionGateway('token', employee),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useAttachReceipt('r1', reports), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

describe('useAttachReceipt', () => {
  it('hands the receipt to the controller for the report', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/expense-reports/r1/receipts', {
      status: 201,
      data: {},
    });
    const { result } = renderMutation(http);

    await act(async () => {
      await result.current.mutateAsync(receipt);
    });

    expect(http.calls[0]).toMatchObject({
      method: 'post',
      url: 'companies/c1/expense-reports/r1/receipts',
      data: { fileName: 'ticket.pdf', contentBase64: 'SGVsbG8=' },
    });
  });

  it('surfaces the refusal of an invalid file', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/receipts',
      new Error(ErrorCode.INVALID_FILE),
    );
    const { result } = renderMutation(http);

    await act(async () => {
      result.current.mutate(receipt);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
