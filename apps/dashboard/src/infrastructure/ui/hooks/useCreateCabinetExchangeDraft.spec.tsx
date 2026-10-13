import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  CabinetExchangeSnapshot,
  ErrorCode,
  ExchangeDirection,
  ExchangeStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { createCabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { i18n } from '../i18n/i18n';
import { useCreateCabinetExchangeDraft } from './useCreateCabinetExchangeDraft';
import { useListCabinetExchanges } from './useListCabinetExchanges';

const created: CabinetExchangeSnapshot = {
  id: 'ex-1',
  direction: ExchangeDirection.COMPANY_TO_CABINET,
  status: ExchangeStatus.DRAFT,
  category: 'Facture',
  document: { fileName: 'a.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'u1',
  date: '2026-10-06T09:00:00.000Z',
};

const file = {
  fileName: 'a.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([72, 105]),
};

function setup(refusal?: ErrorCode) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/cabinet-exchanges', {
    status: 200,
    data: [],
  });
  if (refusal === undefined) {
    http.reply('post', 'companies/c1/cabinet-exchanges', {
      status: 201,
      data: created,
    });
  } else {
    http.reject('post', 'companies/c1/cabinet-exchanges', new Error(refusal));
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'u1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    }),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const rendered = renderHook(
    () => ({
      list: useListCabinetExchanges(deps),
      create: useCreateCabinetExchangeDraft(deps),
    }),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      ),
    },
  );
  return { http, deps, ...rendered };
}

describe('useCreateCabinetExchangeDraft', () => {
  it('hands the category and the file to the api', async () => {
    const { http, result } = setup();

    await act(async () => {
      await result.current.create.mutateAsync({ category: 'Facture', file });
    });

    expect(http.calls.find((call) => call.method === 'post')?.data).toEqual({
      category: 'Facture',
      file: {
        fileName: 'a.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGk=',
      },
    });
  });

  it('refreshes the list once the draft is created', async () => {
    const { http, result } = setup();
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    http.reply('get', 'companies/c1/cabinet-exchanges', {
      status: 200,
      data: [created],
    });

    await act(async () => {
      await result.current.create.mutateAsync({ category: 'Facture', file });
    });

    await waitFor(() =>
      expect(result.current.list.data?.map((exchange) => exchange.id)).toEqual([
        'ex-1',
      ]),
    );
  });

  it('surfaces the refusal of an invalid file', async () => {
    const { deps, result } = setup(ErrorCode.INVALID_FILE);

    await act(async () => {
      result.current.create.mutate({ category: 'Facture', file });
    });
    await waitFor(() => expect(result.current.create.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.create.error)).toBe(
      i18n.messages.errors.INVALID_FILE,
    );
  });
});
