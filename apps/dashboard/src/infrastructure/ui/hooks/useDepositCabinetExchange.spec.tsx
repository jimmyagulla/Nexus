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
import { useDepositCabinetExchange } from './useDepositCabinetExchange';

const deposited: CabinetExchangeSnapshot = {
  id: 'ex-9',
  direction: ExchangeDirection.CABINET_TO_COMPANY,
  status: ExchangeStatus.RECEIVED,
  category: 'Bilan',
  document: { fileName: 'bilan.pdf', mimeType: 'application/pdf', size: 2 },
  senderId: 'cab-1',
  date: '2026-10-08T10:00:00.000Z',
  consultedAt: null,
};

const file = {
  fileName: 'bilan.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([72, 105]),
};

const DEPOSIT = 'companies/c1/cabinet-exchanges/deposit';

function setup(refusal?: ErrorCode) {
  const http = new InMemoryHttpClient();
  if (refusal === undefined) {
    http.reply('post', DEPOSIT, { status: 201, data: deposited });
  } else {
    http.reject('post', DEPOSIT, new Error(refusal));
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  const rendered = renderHook(() => useDepositCabinetExchange(deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    ),
  });
  return { http, deps, ...rendered };
}

describe('useDepositCabinetExchange', () => {
  it('hands the category and the file to the api', async () => {
    const { http, result } = setup();

    await act(async () => {
      await result.current.mutateAsync({ category: 'Bilan', file });
    });

    expect(http.calls[0]?.data).toEqual({
      category: 'Bilan',
      file: {
        fileName: 'bilan.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGk=',
      },
    });
  });

  it('surfaces the refusal of a revoked cabinet', async () => {
    const { deps, result } = setup(ErrorCode.ACCESS_DENIED);

    await act(async () => {
      result.current.mutate({ category: 'Bilan', file });
    });
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(deps.errorPresenter.present(result.current.error)).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });
});
