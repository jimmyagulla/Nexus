import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import { ExpenseReportList, UserRole } from '@hexagonal-monorepo-template/domain';
import { EVERY_EXPENSE_REPORT } from '../../../../adapters/controllers/expense-reports.controller';
import { createExpenseReportsPageComposition } from '../../../composition/expense-report/expense-reports-page.composition';
import { InMemoryHttpClient } from '../../../network/in-memory-http-client';
import { useGetExpenseReports } from './useGetExpenseReports';
import { useSubmitExpenseReport } from './useSubmitExpenseReport';
import { useViewExpenseReportProof } from './useViewExpenseReportProof';

function listOf(descriptions: string[]): ExpenseReportList {
  return {
    items: descriptions.map((description, index) => ({
      id: `e${index}`, date: '2026-09-12', category: 'PARKING', paymentMethod: 'PERSONAL_CARD', amount: '12.00',
      vatRate: null, vatAmount: null, description, project: null,
      proof: { fileName: 'ticket.pdf', format: 'PDF', sizeBytes: 4 }, status: 'SUBMITTED', editable: true,
      submittedAt: '2026-09-12T18:00:00.000Z', processedAt: null,
    })),
    total: descriptions.length,
    categoryCounts: { OTHER: 0, FUEL: 0, TRAVEL: 0, HOTEL: 0, PARKING: descriptions.length, MEAL: 0 },
    statusCounts: { IN_PROGRESS: 0, REJECTED: 0, REFUNDED: 0, SUBMITTED: descriptions.length },
    proofCounts: { WITH: descriptions.length, WITHOUT: 0 },
    projectCounts: [],
    stats: { pending: { count: descriptions.length, amount: '12.00' }, refunded: { year: 2026, amount: '0.00' }, averageProcessingDays: null },
  };
}

function setUp() {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-reports?sort=DATE&direction=DESC', { status: 200, data: listOf(['Parking Polygone']) });
  http.reply('get', 'companies/c1/expense-reports?sort=AMOUNT&direction=ASC', { status: 200, data: listOf(['Moins cher']) });
  http.reply('post', 'companies/c1/expense-reports', { status: 201, data: listOf(['Nouvelle']).items[0] });
  http.reply('get', 'companies/c1/expense-reports/e0/proof', {
    status: 200, data: { url: 'https://storage/e0', fileName: 'ticket.pdf', contentType: 'application/pdf' },
  });
  http.reply('get', 'https://storage/e0', Uint8Array.from([0x25, 0x50, 0x44, 0x46]));
  const sessions = new InMemorySessionGateway('token', { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYEE });
  const deps = createExpenseReportsPageComposition(http, sessions);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { http, deps, wrapper };
}

beforeAll(() => {
  // jsdom reads no file into a local URL: the viewer only needs one to show.
  URL.createObjectURL = () => 'blob:http://app/receipt';
});

describe('useGetExpenseReports', () => {
  it('presents the list, its key figures and its rows', async () => {
    const { deps, wrapper } = setUp();

    const { result } = renderHook(() => useGetExpenseReports(deps, EVERY_EXPENSE_REPORT), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.rows.map((row) => row.name)).toEqual(['Parking Polygone']);
    expect(result.current.data?.kpis[0]?.label).toBe('En cours · 1 note');
  });

  it('asks again with the chosen ordering', async () => {
    const { deps, wrapper } = setUp();

    const { result } = renderHook(() => useGetExpenseReports(deps, { ...EVERY_EXPENSE_REPORT, sort: 'AMOUNT', direction: 'ASC' }), { wrapper });

    await waitFor(() => expect(result.current.data?.rows[0]?.name).toBe('Moins cher'));
  });
});

describe('useSubmitExpenseReport', () => {
  it('submits the form, then lists again', async () => {
    const { http, deps, wrapper } = setUp();
    const { result } = renderHook(() => ({ list: useGetExpenseReports(deps, EVERY_EXPENSE_REPORT), submit: useSubmitExpenseReport(deps) }), { wrapper });
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));

    await act(() => result.current.submit.mutateAsync({
      date: '2026-09-12', category: 'PARKING', paymentMethod: 'PERSONAL_CARD', amount: '12', vatRate: 'none',
      description: 'Nouvelle', project: '', proof: null, keepProof: false,
    }));

    await waitFor(() => expect(http.calls.filter((call) => call.method === 'get')).toHaveLength(2));
  });
});

describe('useViewExpenseReportProof', () => {
  it('reads the receipt for the in-app viewer', async () => {
    const { deps, wrapper } = setUp();
    const { result } = renderHook(() => useViewExpenseReportProof(deps), { wrapper });

    const preview = await act(() => result.current.mutateAsync('e0'));

    expect(preview).toMatchObject({ fileName: 'ticket.pdf', contentType: 'application/pdf', objectUrl: 'blob:http://app/receipt' });
  });
});
