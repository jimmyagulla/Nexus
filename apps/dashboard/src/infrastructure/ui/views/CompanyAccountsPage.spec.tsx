import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  AccountStatus,
  AccountSummary,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  CompanyAccountsComposition,
  createCompanyAccountsComposition,
} from '../../composition/company-accounts.composition';
import { i18n } from '../i18n/i18n';
import { CompanyAccountsPage } from './CompanyAccountsPage';

const founder: AccountSummary = {
  id: 'founder',
  identifier: 'founder',
  role: UserRole.EMPLOYER,
  status: AccountStatus.ACTIVE,
  locked: false,
};

const partner: AccountSummary = {
  id: 'partner',
  identifier: 'partner',
  role: UserRole.EMPLOYER,
  status: AccountStatus.DISABLED,
  locked: false,
};

const employer = { userId: 'founder', companyId: 'c1', role: UserRole.EMPLOYER };

function compositionWith(
  http: InMemoryHttpClient,
): CompanyAccountsComposition {
  return createCompanyAccountsComposition(
    http,
    new InMemorySessionGateway('jwt', employer),
  );
}

function httpListing(accounts: AccountSummary[]): InMemoryHttpClient {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/accounts', { status: 200, data: accounts });
  return http;
}

function renderPage(deps: CompanyAccountsComposition) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <CompanyAccountsPage deps={deps} />
    </QueryClientProvider>,
  );
}

describe('CompanyAccountsPage', () => {
  it('lists the identifier, the role and the status of the company accounts', async () => {
    renderPage(compositionWith(httpListing([founder, partner])));

    expect(await screen.findByText('founder')).toBeTruthy();
    expect(screen.getByText('partner')).toBeTruthy();
    expect(screen.getAllByText(i18n.messages.accounts.roles.EMPLOYER)).toHaveLength(
      2,
    );
    expect(screen.getByText(i18n.messages.accounts.statuses.ACTIVE)).toBeTruthy();
    expect(
      screen.getByText(i18n.messages.accounts.statuses.DISABLED),
    ).toBeTruthy();
  });

  it('shows a readable message when an employee opens the list', async () => {
    const http = new InMemoryHttpClient();
    http.reject('get', 'companies/c1/accounts', new Error(ErrorCode.ACCESS_DENIED));

    renderPage(compositionWith(http));

    expect(
      await screen.findByText(i18n.messages.errors.ACCESS_DENIED),
    ).toBeTruthy();
  });

  it('offers to disable an active account and to restore a disabled one', async () => {
    renderPage(compositionWith(httpListing([founder, partner])));

    await screen.findByText('founder');

    expect(
      screen.getAllByRole('button', { name: i18n.messages.accounts.disable }),
    ).toHaveLength(1);
    expect(
      screen.getAllByRole('button', { name: i18n.messages.accounts.restore }),
    ).toHaveLength(1);
  });

  it('says why a locked account cannot sign in and offers to restore it', async () => {
    renderPage(compositionWith(httpListing([{ ...founder, locked: true }])));

    expect(
      await screen.findByText(i18n.messages.errors.ACCOUNT_LOCKED),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: i18n.messages.accounts.restore }),
    ).toBeTruthy();
  });

  it('disables an account on the api', async () => {
    const http = httpListing([{ ...partner, status: AccountStatus.ACTIVE }]);
    http.reply('post', 'companies/c1/accounts/partner/disable', {
      status: 201,
      data: partner,
    });
    renderPage(compositionWith(http));

    fireEvent.click(
      await screen.findByRole('button', { name: i18n.messages.accounts.disable }),
    );

    await waitFor(() =>
      expect(
        http.calls.some(
          (call) => call.url === 'companies/c1/accounts/partner/disable',
        ),
      ).toBe(true),
    );
  });

  it('explains why the last employer cannot be disabled', async () => {
    const http = httpListing([founder]);
    http.reject(
      'post',
      'companies/c1/accounts/founder/disable',
      new Error(ErrorCode.ACCESS_DENIED),
    );
    renderPage(compositionWith(http));

    fireEvent.click(
      await screen.findByRole('button', { name: i18n.messages.accounts.disable }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('restores a disabled account on the api', async () => {
    const http = httpListing([founder, partner]);
    http.reply('post', 'companies/c1/accounts/partner/restore', {
      status: 201,
      data: { ...partner, status: AccountStatus.ACTIVE },
    });
    renderPage(compositionWith(http));

    fireEvent.click(
      await screen.findByRole('button', { name: i18n.messages.accounts.restore }),
    );

    await waitFor(() =>
      expect(
        http.calls.some(
          (call) => call.url === 'companies/c1/accounts/partner/restore',
        ),
      ).toBe(true),
    );
  });

  it('invites an employer and hands over the activation link', async () => {
    const http = httpListing([founder]);
    http.reply('post', 'companies/c1/accounts', {
      status: 201,
      data: {
        id: 'colleague',
        identifier: 'colleague',
        role: UserRole.EMPLOYER,
        status: AccountStatus.INVITED,
        invitationToken: 'invite-1',
      },
    });
    renderPage(compositionWith(http));

    fireEvent.change(
      await screen.findByLabelText(i18n.messages.accounts.identifier),
      { target: { value: 'colleague' } },
    );
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.accounts.invite }),
    );

    const notice = await screen.findByRole('status');
    expect(within(notice).getByText('/activation?token=invite-1')).toBeTruthy();
  });

  it('explains why an invitation is refused', async () => {
    const http = httpListing([founder]);
    http.reject(
      'post',
      'companies/c1/accounts',
      new Error(ErrorCode.POTENTIAL_DUPLICATE),
    );
    renderPage(compositionWith(http));

    fireEvent.change(
      await screen.findByLabelText(i18n.messages.accounts.identifier),
      { target: { value: 'founder' } },
    );
    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.accounts.invite }),
    );

    expect((await screen.findByRole('alert')).textContent).toBe(
      i18n.messages.errors.POTENTIAL_DUPLICATE,
    );
  });

  it('asks for an identifier before inviting', async () => {
    renderPage(compositionWith(httpListing([founder])));

    fireEvent.click(
      await screen.findByRole('button', { name: i18n.messages.accounts.invite }),
    );

    expect(
      await screen.findByText(i18n.messages.errors.REQUIRED_INFORMATION),
    ).toBeTruthy();
  });
});
