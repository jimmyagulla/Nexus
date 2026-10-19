import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InMemoryKeyValueStorage, InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import {
  DocumentCategory,
  DocumentList,
  DocumentSort,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import type { DocumentsListState } from '../../../../adapters/controllers/documents.controller';
import { createDocumentsPageComposition } from '../../../composition/document/documents-page.composition';
import { InMemoryHttpClient } from '../../../network/in-memory-http-client';
import { createSeenItemsStore, SEEN_DOCUMENTS_KEY } from '../../stores/seen-items.store';
import { useDepositDocuments } from './useDepositDocuments';
import { getDocumentsQueryKey, useGetDocuments } from './useGetDocuments';
import { useGetUnseenDocumentCount } from './useGetUnseenDocumentCount';
import { useViewDocument } from './useViewDocument';

const nothing: DocumentsListState = {
  search: '', categories: [], statuses: [], emitters: [], from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
};

function listOf(names: string[]): DocumentList {
  return {
    items: names.map((name, index) => ({
      id: `d${index}`, name, category: DocumentCategory.OTHER, status: 'PENDING', format: 'PDF', sizeBytes: 10,
      emitter: 'SELF', comment: null, createdAt: '2026-10-03T10:24:00.000Z',
    })),
    total: names.length,
    categoryCounts: { SICK_LEAVE: 0, OTHER: names.length, ADMINISTRATIVE: 0, PROOF: 0 },
    statusCounts: { SEEN: 0, PENDING: names.length, NEW: 0, PROCESSED: 0 },
  };
}

function setUp() {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/documents?sort=DATE&direction=DESC', { status: 200, data: listOf(['Ancien']) });
  http.reply('get', 'companies/c1/documents?sort=SIZE&direction=DESC', { status: 200, data: listOf(['Lourd']) });
  http.reply('post', 'companies/c1/documents', { status: 201, data: listOf(['Nouveau']).items });
  http.reply('post', 'companies/c1/documents/d0/view', {
    status: 201,
    data: { url: 'https://storage/d0', fileName: 'Ancien.pdf', contentType: 'application/pdf' },
  });
  http.reply('get', 'https://storage/d0', Uint8Array.from([0x25, 0x50, 0x44, 0x46]));
  const sessions = new InMemorySessionGateway('token', { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE });
  const deps = createDocumentsPageComposition(http, sessions, createSeenItemsStore(new InMemoryKeyValueStorage(), SEEN_DOCUMENTS_KEY));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { http, deps, client, wrapper };
}

beforeAll(() => {
  // jsdom reads no file into a local URL: the viewer only needs one to show.
  URL.createObjectURL = () => 'blob:http://app/document';
});

describe('useGetDocuments', () => {
  it('presents the list asked for', async () => {
    const { deps, wrapper } = setUp();

    const { result } = renderHook(() => useGetDocuments(deps, nothing), { wrapper });

    await waitFor(() => expect(result.current.data?.rows.map((row) => row.name)).toEqual(['Ancien']));
  });

  it('keeps one cache entry per ordering and serves it again without asking', async () => {
    const { deps, wrapper, http, client } = setUp();
    const { result, rerender } = renderHook(({ state }) => useGetDocuments(deps, state), {
      wrapper,
      initialProps: { state: nothing },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ state: { ...nothing, sort: DocumentSort.SIZE, direction: 'DESC' as const } });
    await waitFor(() => expect(result.current.data?.rows.map((row) => row.name)).toEqual(['Lourd']));
    rerender({ state: nothing });

    expect(result.current.data?.rows.map((row) => row.name)).toEqual(['Ancien']);
    expect(http.calls.filter((call) => call.method === 'get')).toHaveLength(2);
    expect(client.getQueryCache().findAll({ queryKey: getDocumentsQueryKey() })).toHaveLength(2);
  });

  it('refreshes every cached list once documents are deposited', async () => {
    const { deps, wrapper, http } = setUp();
    const { result } = renderHook(
      () => ({ list: useGetDocuments(deps, nothing), deposit: useDepositDocuments(deps) }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    http.reply('get', 'companies/c1/documents?sort=DATE&direction=DESC', { status: 200, data: listOf(['Nouveau', 'Ancien']) });

    await act(async () => {
      await result.current.deposit.mutateAsync({
        category: DocumentCategory.OTHER,
        comment: '',
        files: [{ file: new File(['%PDF-1.7\n'], 'scan.pdf'), name: 'Nouveau' }],
      });
    });

    await waitFor(() => expect(result.current.list.data?.rows.map((row) => row.name)).toEqual(['Nouveau', 'Ancien']));
  });

  it('counts one fewer unseen document once it is opened', async () => {
    const { deps, wrapper } = setUp();
    const { result } = renderHook(
      () => ({ unseen: useGetUnseenDocumentCount(deps), view: useViewDocument(deps) }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.unseen.data).toBe(1));

    await act(async () => {
      await result.current.view.mutateAsync('d0');
    });

    await waitFor(() => expect(result.current.unseen.data).toBe(0));
  });
});
