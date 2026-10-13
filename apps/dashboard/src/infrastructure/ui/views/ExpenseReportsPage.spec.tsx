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
import { ExpenseReportsPage } from './ExpenseReportsPage';

const employee = { userId: 'e1', companyId: 'c1', role: UserRole.EMPLOYEE };

const lyon = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: 'DRAFT',
  receipts: [],
  expenses: [],
};

function renderPage(http: InMemoryHttpClient, opened: string[] = []) {
  const sessions = new InMemorySessionGateway('token', employee);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ExpenseReportsPage
        deps={{
          reports: createExpenseReportsComposition(http, sessions),
          categories: createExpenseCategoriesComposition(http, sessions),
        }}
        onOpen={(id) => opened.push(id)}
      />
    </QueryClientProvider>,
  );
}

function httpWith(list: unknown): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-reports', { status: 200, data: list });
  http.reply('get', 'companies/c1/expense-categories', {
    status: 200,
    data: [{ id: 'restaurant', label: 'Restaurant' }],
  });
  return http;
}

describe('ExpenseReportsPage', () => {
  it('waits while the reports are being read', () => {
    renderPage(new InMemoryHttpClient());

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('lists the reports of the employee', async () => {
    renderPage(httpWith({ canCreate: true, reports: [lyon] }));

    expect(await screen.findByText('Déplacement Lyon')).toBeTruthy();
    expect(screen.getByText(i18n.messages.expenseReports.status.DRAFT)).toBeTruthy();
  });

  it('announces that no report has been submitted yet', async () => {
    renderPage(httpWith({ canCreate: true, reports: [] }));

    expect(
      await screen.findByText(i18n.messages.expenseReports.empty),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: i18n.messages.expenseReports.create }),
    ).toBeTruthy();
  });

  it('shows a readable message when the reports cannot be loaded', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'get',
      'companies/c1/expense-reports',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    renderPage(http);

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('opens a report', async () => {
    const opened: string[] = [];
    renderPage(httpWith({ canCreate: true, reports: [lyon] }), opened);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.open,
      }),
    );

    expect(opened).toEqual(['r1']);
  });

  it('creates a report from the dialog and closes it', async () => {
    const http = httpWith({ canCreate: true, reports: [] });
    http.reply('post', 'companies/c1/expense-reports', {
      status: 201,
      data: lyon,
    });
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.create,
      }),
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(i18n.messages.expenseReports.label), {
      target: { value: 'Déplacement Lyon' },
    });
    fireEvent.click(
      dialog.getByRole('button', { name: i18n.messages.expenseReports.create }),
    );

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(http.calls.find((call) => call.method === 'post')?.data).toEqual({
      label: 'Déplacement Lyon',
    });
  });

  it('explains inside the dialog why the report was refused', async () => {
    const http = httpWith({ canCreate: true, reports: [] });
    http.reject(
      'post',
      'companies/c1/expense-reports',
      new Error(ErrorCode.INACTIVE_EMPLOYEE),
    );
    renderPage(http);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.create,
      }),
    );
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.change(dialog.getByLabelText(i18n.messages.expenseReports.label), {
      target: { value: 'Lyon' },
    });
    fireEvent.click(
      dialog.getByRole('button', { name: i18n.messages.expenseReports.create }),
    );

    expect((await dialog.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.INACTIVE_EMPLOYEE,
    );
  });
});
