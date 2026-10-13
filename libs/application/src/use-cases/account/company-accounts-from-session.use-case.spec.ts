import {
  ApiAccountGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  AccountStatus,
  AccountSummary,
  ActorContext,
  ErrorCode,
  InvitedAccount,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { DisableAccountFromSessionUseCase } from './disable-account-from-session.use-case';
import { InviteEmployerFromSessionUseCase } from './invite-employer-from-session.use-case';
import { ListCompanyAccountsFromSessionUseCase } from './list-company-accounts-from-session.use-case';
import { RestoreAccountFromSessionUseCase } from './restore-account-from-session.use-case';

const actor: ActorContext = {
  userId: 'founder',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const partner: AccountSummary = {
  id: 'partner',
  identifier: 'partner',
  role: UserRole.EMPLOYER,
  status: AccountStatus.DISABLED,
  locked: false,
};

const invited: InvitedAccount = {
  id: 'guest',
  identifier: 'guest',
  role: UserRole.EMPLOYER,
  status: AccountStatus.INVITED,
  invitationToken: 'invite-guest',
};

function gateway(): ApiAccountGateway {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/accounts', { status: 200, data: [partner] });
  http.reply('post', 'companies/c1/accounts', { status: 201, data: invited });
  http.reply('post', 'companies/c1/accounts/partner/disable', {
    status: 201,
    data: partner,
  });
  http.reply('post', 'companies/c1/accounts/partner/restore', {
    status: 201,
    data: { ...partner, status: AccountStatus.ACTIVE },
  });
  return new ApiAccountGateway(http);
}

const sessions = {
  signedIn: () => new InMemorySessionGateway('token', actor),
  withoutCompany: () =>
    new InMemorySessionGateway('token', { ...actor, companyId: null }),
  withoutToken: () => new InMemorySessionGateway(null, actor),
  anonymous: () => new InMemorySessionGateway(null, null),
};

describe('ListCompanyAccountsFromSessionUseCase', () => {
  it('lists the accounts of the company of the signed-in actor', async () => {
    await expect(
      new ListCompanyAccountsFromSessionUseCase(
        sessions.signedIn(),
        gateway(),
      ).execute(),
    ).resolves.toEqual([partner]);
  });

  it.each(['withoutCompany', 'withoutToken', 'anonymous'] as const)(
    'refuses a session that is %s',
    async (kind) => {
      await expect(
        new ListCompanyAccountsFromSessionUseCase(
          sessions[kind](),
          gateway(),
        ).execute(),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    },
  );
});

describe('InviteEmployerFromSessionUseCase', () => {
  it('invites an employer into the company of the signed-in actor', async () => {
    await expect(
      new InviteEmployerFromSessionUseCase(
        sessions.signedIn(),
        gateway(),
      ).execute('guest'),
    ).resolves.toEqual(invited);
  });

  it('refuses a session without a company', async () => {
    await expect(
      new InviteEmployerFromSessionUseCase(
        sessions.withoutCompany(),
        gateway(),
      ).execute('guest'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('DisableAccountFromSessionUseCase', () => {
  it('disables an account of the company of the signed-in actor', async () => {
    await expect(
      new DisableAccountFromSessionUseCase(
        sessions.signedIn(),
        gateway(),
      ).execute('partner'),
    ).resolves.toEqual(partner);
  });

  it('refuses a session without a token', async () => {
    await expect(
      new DisableAccountFromSessionUseCase(
        sessions.withoutToken(),
        gateway(),
      ).execute('partner'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});

describe('RestoreAccountFromSessionUseCase', () => {
  it('restores an account of the company of the signed-in actor', async () => {
    await expect(
      new RestoreAccountFromSessionUseCase(
        sessions.signedIn(),
        gateway(),
      ).execute('partner'),
    ).resolves.toMatchObject({ status: AccountStatus.ACTIVE });
  });

  it('refuses when there is no session at all', async () => {
    await expect(
      new RestoreAccountFromSessionUseCase(
        sessions.anonymous(),
        gateway(),
      ).execute('partner'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
