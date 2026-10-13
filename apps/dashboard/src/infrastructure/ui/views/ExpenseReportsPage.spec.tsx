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
  reimbursedAmount: null,
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
        title={i18n.messages.expenseReports.title}
        emptyMessage={i18n.messages.expenseReports.empty}
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
    renderPage(httpWith({ canCreate: true, reports: [lyon], totalAmount: 0 }));

    expect(await screen.findByText('Déplacement Lyon')).toBeTruthy();
    expect(
      within(screen.getByRole('listitem')).getByText(
        i18n.messages.expenseReports.status.DRAFT,
      ),
    ).toBeTruthy();
  });

  it('announces that no report has been submitted yet', async () => {
    renderPage(httpWith({ canCreate: true, reports: [], totalAmount: 0 }));

    expect(
      await screen.findByText(i18n.messages.expenseReports.empty),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: i18n.messages.expenseReports.create }),
    ).toBeTruthy();
  });

  it('shows the employer the submitted reports under the title she is given', async () => {
    const http = httpWith({
      canCreate: false,
      totalAmount: 0,
      reports: [{ ...lyon, status: 'SUBMITTED' }],
    });
    const sessions = new InMemorySessionGateway('token', {
      userId: 'u1',
      companyId: 'c1',
      role: UserRole.EMPLOYER,
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={client}>
        <ExpenseReportsPage
          title={i18n.messages.expenseReports.employerTitle}
          emptyMessage={null}
          deps={{
            reports: createExpenseReportsComposition(http, sessions),
            categories: createExpenseCategoriesComposition(http, sessions),
          }}
          onOpen={() => undefined}
        />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Déplacement Lyon')).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        name: i18n.messages.expenseReports.employerTitle,
      }),
    ).toBeTruthy();
    expect(
      within(screen.getByRole('listitem')).getByText(
        i18n.messages.expenseReports.status.SUBMITTED,
      ),
    ).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: i18n.messages.expenseReports.create }),
    ).toBeNull();
  });

  it('asks the api for the reports matching the filter the user applies', async () => {
    const http = httpWith({ canCreate: true, reports: [lyon], totalAmount: 0 });
    http.reply('get', 'companies/c1/expense-reports?status=SUBMITTED&minAmount=10', {
      status: 200,
      data: { canCreate: true, reports: [], totalAmount: 0 },
    });
    renderPage(http);

    fireEvent.change(
      await screen.findByLabelText(i18n.messages.expenseReports.filters.status),
      { target: { value: 'SUBMITTED' } },
    );
    fireEvent.change(
      screen.getByLabelText(i18n.messages.expenseReports.filters.minAmount),
      { target: { value: '10' } },
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.filters.apply,
      }),
    );

    await waitFor(() =>
      expect(
        http.calls.some(
          (call) =>
            call.url ===
            'companies/c1/expense-reports?status=SUBMITTED&minAmount=10',
        ),
      ).toBe(true),
    );
  });

  it('keeps the filter form on screen while the filtered reports load', async () => {
    const http = httpWith({ canCreate: true, reports: [lyon], totalAmount: 0 });
    http.reply('get', 'companies/c1/expense-reports?status=DRAFT', {
      status: 200,
      data: { canCreate: true, reports: [lyon], totalAmount: 0 },
    });
    renderPage(http);

    fireEvent.change(
      await screen.findByLabelText(i18n.messages.expenseReports.filters.status),
      { target: { value: 'DRAFT' } },
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.filters.apply,
      }),
    );

    await waitFor(() =>
      expect(
        screen.getByLabelText<HTMLSelectElement>(
          i18n.messages.expenseReports.filters.status,
        ).value,
      ).toBe('DRAFT'),
    );
  });

  it('does not tell the employee she submitted nothing when her filter finds nothing', async () => {
    const http = httpWith({ canCreate: true, reports: [lyon], totalAmount: 0 });
    http.reply('get', 'companies/c1/expense-reports?status=REFUSED', {
      status: 200,
      data: { canCreate: true, reports: [], totalAmount: 0 },
    });
    renderPage(http);

    fireEvent.change(
      await screen.findByLabelText(i18n.messages.expenseReports.filters.status),
      { target: { value: 'REFUSED' } },
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.messages.expenseReports.filters.apply,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByText('Déplacement Lyon')).toBeNull(),
    );
    expect(screen.queryByText(i18n.messages.expenseReports.empty)).toBeNull();
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
    renderPage(httpWith({ canCreate: true, reports: [lyon], totalAmount: 0 }), opened);

    fireEvent.click(
      await screen.findByRole('button', {
        name: i18n.messages.expenseReports.open,
      }),
    );

    expect(opened).toEqual(['r1']);
  });

  it('creates a report from the dialog and closes it', async () => {
    const http = httpWith({ canCreate: true, reports: [], totalAmount: 0 });
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
    const http = httpWith({ canCreate: true, reports: [], totalAmount: 0 });
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
