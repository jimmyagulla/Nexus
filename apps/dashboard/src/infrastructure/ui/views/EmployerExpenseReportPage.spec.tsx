import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { i18n } from '../i18n/i18n';
import { EmployerExpenseReportPage } from './EmployerExpenseReportPage';

const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };
const names = i18n.messages.expenseReports;

function snapshot(status: string) {
  return {
    id: 'r1',
    companyId: 'c1',
    employeeId: 'e1',
    label: 'Déplacement Lyon',
    status,
    total: 68,
    reimbursedAmount: null,
    receipts: [
      {
        id: 'f1',
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        size: 3,
        expenseId: null,
      },
    ],
    expenses: [
      {
        id: 'x1',
        date: '2026-10-05',
        categoryId: 'train',
        amount: 68,
        vat: null,
        paymentMethod: 'Carte',
        description: 'Billet',
        assignment: 'Projet X',
      },
    ],
  };
}

function httpOpening(status = 'UNDER_REVIEW'): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('post', 'companies/c1/expense-reports/r1/opening', {
    status: 201,
    data: snapshot(status),
  });
  http.reply('get', 'companies/c1/expense-categories', {
    status: 200,
    data: [{ id: 'train', label: 'Train' }],
  });
  return http;
}

function renderPage(http: InMemoryHttpClient, onBack: () => void = () => undefined) {
  const sessions = new InMemorySessionGateway('token', employer);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <EmployerExpenseReportPage
        reportId="r1"
        deps={{
          reports: createExpenseReportsComposition(http, sessions),
          categories: createExpenseCategoriesComposition(http, sessions),
        }}
        onBack={onBack}
      />
    </QueryClientProvider>,
  );
}

describe('EmployerExpenseReportPage', () => {
  it('waits while the report is being opened', () => {
    renderPage(new InMemoryHttpClient());

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('opens the report and shows its expenses and receipts', async () => {
    const http = httpOpening();
    renderPage(http);

    expect(
      await screen.findByRole('heading', { name: 'Déplacement Lyon' }),
    ).toBeTruthy();
    expect(screen.getByText('Train')).toBeTruthy();
    expect(screen.getByText('ticket.pdf')).toBeTruthy();
    expect(screen.getByText(names.status.UNDER_REVIEW)).toBeTruthy();
    expect(http.calls.some((call) => call.url.endsWith('/opening'))).toBe(true);
  });

  it('shows a readable message when the report cannot be opened', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/opening',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    http.reply('get', 'companies/c1/expense-categories', {
      status: 200,
      data: [],
    });
    renderPage(http);

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it.each([
    [names.requestInformation, 'information-request'],
    [names.validate, 'validation'],
    [names.refuse, 'refusal'],
  ])('sends the employer decision %s to the api', async (label, path) => {
    const http = httpOpening();
    http.reply('post', `companies/c1/expense-reports/r1/${path}`, {
      status: 201,
      data: snapshot('VALIDATED'),
    });
    renderPage(http);

    fireEvent.click(await screen.findByRole('button', { name: label }));

    await waitFor(() =>
      expect(http.calls.some((call) => call.url.endsWith(`/${path}`))).toBe(
        true,
      ),
    );
  });

  it('records the reimbursement of a validated report and confirms it', async () => {
    const http = httpOpening('VALIDATED');
    http.reply('post', 'companies/c1/expense-reports/r1/reimbursement', {
      status: 201,
      data: snapshot('REIMBURSED'),
    });
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', { name: names.reimburse }),
    );

    expect((await screen.findByRole('status')).textContent).toBe(
      'La note de frais a été marquée comme remboursée.',
    );
    expect(
      http.calls.some((call) => call.url.endsWith('/reimbursement')),
    ).toBe(true);
  });

  it('does not offer the reimbursement before the report is validated', async () => {
    renderPage(httpOpening('UNDER_REVIEW'));

    await screen.findByRole('button', { name: names.validate });
    expect(screen.queryByRole('button', { name: names.reimburse })).toBeNull();
  });

  it('explains why a decision was refused', async () => {
    const http = httpOpening();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/validation',
      new Error(ErrorCode.REQUEST_ALREADY_PROCESSED),
    );
    renderPage(http);

    fireEvent.click(await screen.findByRole('button', { name: names.validate }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.REQUEST_ALREADY_PROCESSED,
    );
  });

  it('only offers to ask for information while the report is merely submitted', async () => {
    renderPage(httpOpening('SUBMITTED'));

    expect(
      await screen.findByRole('button', { name: names.requestInformation }),
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: names.validate })).toBeNull();
  });

  it('goes back to the reports', async () => {
    let backed = 0;
    renderPage(httpOpening(), () => {
      backed += 1;
    });

    fireEvent.click(await screen.findByRole('button', { name: names.back }));

    expect(backed).toBe(1);
  });
});
