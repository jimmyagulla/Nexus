import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryKeyValueStorage,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { PayslipList, UserRole } from '@hexagonal-monorepo-template/domain';
import { createPayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { InMemoryHttpClient } from '../../../network/in-memory-http-client';
import { createSeenItemsStore, SEEN_PAYSLIPS_KEY } from '../../stores/seen-items.store';
import { getPayslipsQueryKey, useGetPayslips } from './useGetPayslips';
import { useGetUnseenPayslipCount } from './useGetUnseenPayslipCount';
import { useViewPayslip } from './useViewPayslip';

function listOf(year: number, months: number[], years = [year]): PayslipList {
  return {
    items: months.map((month) => ({
      id: `${year}-${month}`, year, month, employerName: 'Atelier Moreau', 
      fileName: `Bulletin_${year}-${month}.pdf`, format: 'PDF', sizeBytes: 10, availableAt: `${year}-0${month}-28T08:00:00.000Z`,
    })),
    total: months.length,
    years,
  };
}

function setUp() {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/payslips?year=2026', { status: 200, data: listOf(2026, [1, 2], [2025, 2026]) });
  http.reply('get', 'companies/c1/payslips?year=2025', { status: 200, data: listOf(2025, [12], [2025, 2026]) });
  http.reply('get', 'companies/c1/payslips', { status: 200, data: listOf(2026, [1, 2]) });
  http.reply('get', 'companies/c1/payslips/2026-1/view', {
    status: 200,
    data: { payslipId: '2026-1', url: 'https://storage/2026-1', fileName: 'Bulletin_2026-1.pdf', contentType: 'application/pdf' },
  });
  http.reply('get', 'https://storage/2026-1', Uint8Array.from([0x25, 0x50, 0x44, 0x46]));
  const sessions = new InMemorySessionGateway('token', { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE });
  const deps = createPayslipsPageComposition(http, sessions, createSeenItemsStore(new InMemoryKeyValueStorage(), SEEN_PAYSLIPS_KEY));
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { http, deps, client, wrapper };
}

beforeAll(() => {
  // jsdom reads no file into a local URL: the viewer only needs one to show.
  URL.createObjectURL = () => 'blob:http://app/payslip';
});

describe('useGetPayslips', () => {
  it('presents the payslips of the year asked for, January first', async () => {
    const { deps, wrapper } = setUp();

    const { result } = renderHook(() => useGetPayslips(deps, { year: 2026 }), { wrapper });

    await waitFor(() => expect(result.current.data?.rows.map((row) => row.period)).toEqual(['Janvier 2026', 'Février 2026']));
    expect(result.current.data?.year).toMatchObject({ year: '2026', previousYear: 2025, nextYear: null });
  });

  it('waits while the year is not known yet', () => {
    const { deps, wrapper, http } = setUp();

    const { result } = renderHook(() => useGetPayslips(deps, null), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(http.calls).toEqual([]);
  });

  it('keeps one cache entry per year and serves it again without asking', async () => {
    const { deps, wrapper, http, client } = setUp();
    const { result, rerender } = renderHook(({ year }) => useGetPayslips(deps, { year }), {
      wrapper,
      initialProps: { year: 2026 },
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ year: 2025 });
    await waitFor(() => expect(result.current.data?.rows.map((row) => row.id)).toEqual(['2025-12']));
    rerender({ year: 2026 });

    expect(result.current.data?.rows.map((row) => row.id)).toEqual(['2026-1', '2026-2']);
    expect(http.calls.filter((call) => call.url.startsWith('companies/c1/payslips?'))).toHaveLength(2);
    expect(client.getQueryCache().findAll({ queryKey: getPayslipsQueryKey() })).toHaveLength(2);
  });

  it('shows a payslip as seen, and one fewer unseen payslip, once it is opened', async () => {
    const { deps, wrapper } = setUp();
    const { result } = renderHook(
      () => ({
        list: useGetPayslips(deps, { year: 2026 }),
        unseen: useGetUnseenPayslipCount(deps),
        view: useViewPayslip(deps),
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.unseen.data).toBe(2));

    await act(async () => {
      await result.current.view.mutateAsync('2026-1');
    });

    await waitFor(() => expect(result.current.unseen.data).toBe(1));
    expect(result.current.list.data?.rows.map((row) => [row.id, row.status.label, row.isNew])).toEqual([
      ['2026-1', 'Consulté', false],
      ['2026-2', 'Nouveau', true],
    ]);
  });
});
