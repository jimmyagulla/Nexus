import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode, UserRole } from '@hexagonal-monorepo-template/domain';
import { createExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { i18n } from '../i18n/i18n';
import { ExpenseCategoriesPage } from './ExpenseCategoriesPage';

const employer = { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER };

function renderPage(http: InMemoryHttpClient) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ExpenseCategoriesPage
        deps={createExpenseCategoriesComposition(
          http,
          new InMemorySessionGateway('token', employer),
        )}
      />
    </QueryClientProvider>,
  );
}

function httpWithCategories(): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/expense-categories', {
    status: 200,
    data: [
      { id: 'restaurant', label: 'Restaurant' },
      { id: 'cat-1', label: 'Hôtel' },
    ],
  });
  return http;
}

async function addThroughDialog() {
  fireEvent.click(
    await screen.findByRole('button', {
      name: i18n.messages.expenseCategories.add,
    }),
  );
  const dialog = within(screen.getByRole('dialog'));
  fireEvent.change(
    dialog.getByLabelText(i18n.messages.expenseCategories.label),
    { target: { value: 'Péage' } },
  );
  fireEvent.click(
    dialog.getByRole('button', { name: i18n.messages.expenseCategories.add }),
  );
  return dialog;
}

describe('ExpenseCategoriesPage', () => {
  it('waits while the categories are being read', () => {
    renderPage(new InMemoryHttpClient());

    expect(screen.getByText(i18n.messages.loading)).toBeTruthy();
  });

  it('lists the categories of the company', async () => {
    renderPage(httpWithCategories());

    expect(await screen.findByText('Hôtel')).toBeTruthy();
  });

  it('shows a readable message when the categories cannot be loaded', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'get',
      'companies/c1/expense-categories',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    renderPage(http);

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('adds a category from the dialog and closes it', async () => {
    const http = httpWithCategories();
    http.reply('post', 'companies/c1/expense-categories', {
      status: 201,
      data: [],
    });
    renderPage(http);

    await addThroughDialog();

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(http.calls.find((call) => call.method === 'post')?.data).toEqual({
      label: 'Péage',
    });
  });

  it('explains inside the dialog why the category was refused', async () => {
    const http = httpWithCategories();
    http.reject(
      'post',
      'companies/c1/expense-categories',
      new Error(ErrorCode.POTENTIAL_DUPLICATE),
    );
    renderPage(http);

    const dialog = await addThroughDialog();

    expect((await dialog.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.POTENTIAL_DUPLICATE,
    );
  });
});
