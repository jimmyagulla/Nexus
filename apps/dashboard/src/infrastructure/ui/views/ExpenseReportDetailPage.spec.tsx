import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { createExpenseReportsComposition } from '../../composition/expense-reports.composition';
import { i18n } from '../i18n/i18n';
import { ExpenseReportDetailPage } from './ExpenseReportDetailPage';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };
const labels = i18n.messages.expenseReports.expense;

const report = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: 'DRAFT',
  total: 45,
  receipts: [],
  expenses: [
    {
      id: 'x1',
      date: '2026-10-05',
      categoryId: 'restaurant',
      amount: 45,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Déjeuner client',
      assignment: 'Client Dupont',
    },
  ],
};

function httpWithReport(): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-reports/r1', {
    status: 200,
    data: report,
  });
  http.reply('get', 'companies/c1/expense-categories', {
    status: 200,
    data: [{ id: 'restaurant', label: 'Restaurant' }],
  });
  return http;
}

function renderPage(http: InMemoryHttpClient, onBack: () => void = () => undefined) {
  const sessions = new InMemorySessionGateway('token', employee);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ExpenseReportDetailPage
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

async function addExpenseThroughDialog(amount: string) {
  fireEvent.click(
    await screen.findByRole('button', {
      name: i18n.messages.expenseReports.addExpense,
    }),
  );
  const dialog = within(screen.getByRole('dialog'));
  const type = (label: string, value: string) =>
    fireEvent.change(dialog.getByLabelText(label), { target: { value } });
  type(labels.date, '2026-10-05');
  type(labels.category, 'restaurant');
  type(labels.amount, amount);
  type(labels.paymentMethod, 'Carte');
  type(labels.description, 'Déjeuner client');
  type(labels.assignment, 'Client Dupont');
  fireEvent.click(
    dialog.getByRole('button', { name: i18n.messages.expenseReports.addExpense }),
  );
  return dialog;
}

describe('ExpenseReportDetailPage', () => {
  it('waits while the report is being read', () => {
    renderPage(new InMemoryHttpClient());

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('shows the report with its expenses and their category', async () => {
    renderPage(httpWithReport());

    expect(
      await screen.findByRole('heading', { name: 'Déplacement Lyon' }),
    ).toBeTruthy();
    expect(screen.getByText('Restaurant')).toBeTruthy();
    expect(screen.getByText('Déjeuner client')).toBeTruthy();
  });

  it('shows a readable message when the report cannot be loaded', async () => {
    const http = httpWithReport();
    http.reject(
      'get',
      'companies/c1/expense-reports/r1',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    renderPage(http);

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('adds an expense from the dialog and closes it', async () => {
    const http = httpWithReport();
    http.reply('post', 'companies/c1/expense-reports/r1/expenses', {
      status: 201,
      data: report,
    });
    renderPage(http);

    await addExpenseThroughDialog('45');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(http.calls.find((call) => call.method === 'post')?.data).toMatchObject({
      amount: 45,
      categoryId: 'restaurant',
      vat: null,
    });
  });

  it('explains inside the dialog why the expense was refused', async () => {
    const http = httpWithReport();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/expenses',
      new Error(ErrorCode.INVALID_VAT),
    );
    renderPage(http);

    const dialog = await addExpenseThroughDialog('45');

    expect((await dialog.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.INVALID_VAT,
    );
  });

  it('shows the total of the report', async () => {
    renderPage(httpWithReport());

    expect(
      await screen.findByText(`${i18n.messages.expenseReports.total} : 45 €`),
    ).toBeTruthy();
  });

  it('removes an expense on demand', async () => {
    const http = httpWithReport();
    http.reply('delete', 'companies/c1/expense-reports/r1/expenses/x1', {
      status: 200,
      data: report,
    });
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.removeExpense,
      }),
    );

    await waitFor(() =>
      expect(http.calls.some((call) => call.method === 'delete')).toBe(true),
    );
  });

  it('explains why an expense could not be removed', async () => {
    const http = httpWithReport();
    http.reject(
      'delete',
      'companies/c1/expense-reports/r1/expenses/x1',
      new Error(ErrorCode.REQUEST_ALREADY_PROCESSED),
    );
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.removeExpense,
      }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.REQUEST_ALREADY_PROCESSED,
    );
  });

  it('modifies an expense from the dialog and closes it', async () => {
    const http = httpWithReport();
    http.reply('patch', 'companies/c1/expense-reports/r1/expenses/x1', {
      status: 200,
      data: report,
    });
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.editExpense,
      }),
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(labels.amount), {
      target: { value: '50' },
    });
    fireEvent.click(
      dialog.getByRole('button', {
        name: i18n.messages.expenseReports.saveExpense,
      }),
    );

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(http.calls.find((call) => call.method === 'patch')?.data).toMatchObject(
      { amount: 50, categoryId: 'restaurant', description: 'Déjeuner client' },
    );
  });

  it('attaches a receipt from the dialog and closes it', async () => {
    const http = httpWithReport();
    http.reply('post', 'companies/c1/expense-reports/r1/receipts', {
      status: 201,
      data: report,
    });
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.attachReceipt,
      }),
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(
      dialog.getByLabelText(i18n.messages.expenseReports.receiptFile),
      {
        target: {
          files: [
            new File([new Uint8Array([72, 101, 108, 108, 111])], 'ticket.pdf', {
              type: 'application/pdf',
            }),
          ],
        },
      },
    );
    fireEvent.click(
      dialog.getByRole('button', {
        name: i18n.messages.expenseReports.attachReceipt,
      }),
    );

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(http.calls.find((call) => call.method === 'post')?.data).toMatchObject(
      {
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        contentBase64: 'SGVsbG8=',
      },
    );
  });

  it('submits the report', async () => {
    const http = httpWithReport();
    http.reply('post', 'companies/c1/expense-reports/r1/submission', {
      status: 201,
      data: report,
    });
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.submit,
      }),
    );

    await waitFor(() =>
      expect(
        http.calls.some((call) => call.url.endsWith('/submission')),
      ).toBe(true),
    );
  });

  it('explains why the report could not be submitted and leaves it a draft', async () => {
    const http = httpWithReport();
    http.reject(
      'post',
      'companies/c1/expense-reports/r1/submission',
      new Error(ErrorCode.MISSING_DOCUMENT),
    );
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.submit,
      }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.MISSING_DOCUMENT,
    );
    expect(screen.getByText(i18n.messages.expenseReports.status.DRAFT)).toBeTruthy();
  });

  it('goes back to the reports', async () => {
    let backed = 0;
    renderPage(httpWithReport(), () => {
      backed += 1;
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.back,
      }),
    );

    expect(backed).toBe(1);
  });
});
