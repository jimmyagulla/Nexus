import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createCabinetExchangeComposition } from '../../composition/cabinet-exchange.composition';
import { i18n } from '../i18n/i18n';
import { saveFile } from '../lib/save-file';
import { useDownloadCabinetExchangeFile } from './useDownloadCabinetExchangeFile';

vi.mock('../lib/save-file', () => ({ saveFile: vi.fn() }));

const FILE = 'companies/c1/cabinet-exchanges/ex-1/file';

function setup(refusal?: ErrorCode) {
  const http = new InMemoryHttpClient();
  if (refusal === undefined) {
    http.reply('get', FILE, {
      status: 200,
      data: {
        fileName: 'a.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGk=',
      },
    });
  } else {
    http.reject('get', FILE, new Error(refusal));
  }
  const deps = createCabinetExchangeComposition(
    http,
    new InMemorySessionGateway('jwt', {
      userId: 'cab-1',
      companyId: 'c1',
      role: UserRole.ACCOUNTANT,
    }),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const rendered = renderHook(() => useDownloadCabinetExchangeFile(deps), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
  return { deps, ...rendered };
}

describe('useDownloadCabinetExchangeFile', () => {
  beforeEach(() => {
    vi.mocked(saveFile).mockClear();
  });

  it('hands the downloaded file to the browser', async () => {
    const { result } = setup();

    await act(async () => {
      await result.current.mutateAsync('ex-1');
    });

    expect(saveFile).toHaveBeenCalledWith({
      fileName: 'a.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([72, 105]),
    });
  });

  it('saves nothing when the document is not accessible, and says why', async () => {
    const { deps, result } = setup(ErrorCode.INACCESSIBLE_DOCUMENT);

    await act(async () => {
      result.current.mutate('ex-1');
    });
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(saveFile).not.toHaveBeenCalled();
    expect(deps.errorPresenter.present(result.current.error)).toBe(
      i18n.messages.errors.INACCESSIBLE_DOCUMENT,
    );
  });
});
