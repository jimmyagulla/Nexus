import { describe, expect, it } from 'vitest';
import {
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  AccountStatus,
  AccountSummary,
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { i18n } from '../ui/i18n/i18n';
import {
  CompanyAccountsComposition,
  createCompanyAccountsComposition,
} from './company-accounts.composition';

const founder: AccountSummary = {
  id: 'founder',
  identifier: 'founder',
  role: UserRole.EMPLOYER,
  status: AccountStatus.ACTIVE,
  locked: false,
};

const employerOfAcme: ActorContext = {
  userId: 'founder',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const AUTHORIZED = { headers: { Authorization: 'Bearer jwt' } };

function compositionFor(actor: ActorContext | null = employerOfAcme): {
  http: InMemoryHttpClient;
  deps: CompanyAccountsComposition;
} {
  const http = new InMemoryHttpClient();
  http.reply('get', 'companies/c1/accounts', { status: 200, data: [founder] });
  http.reply('post', 'companies/c1/accounts', {
    status: 201,
    data: { ...founder, status: AccountStatus.INVITED, invitationToken: 't' },
  });
  http.reply('post', 'companies/c1/accounts/founder/disable', {
    status: 201,
    data: founder,
  });
  http.reply('post', 'companies/c1/accounts/founder/restore', {
    status: 201,
    data: founder,
  });

  return {
    http,
    deps: createCompanyAccountsComposition(
      http,
      new InMemorySessionGateway(actor === null ? null : 'jwt', actor),
    ),
  };
}

describe('createCompanyAccountsComposition', () => {
  it('wires a controller that lists the accounts of the session company', async () => {
    const { deps, http } = compositionFor();

    await expect(deps.controller.listAccounts()).resolves.toEqual([founder]);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/accounts',
        data: undefined,
        config: AUTHORIZED,
      },
    ]);
  });

  it('wires a controller that invites an employer into the session company', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.inviteEmployer('colleague');

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/accounts',
        data: { identifier: 'colleague' },
        config: AUTHORIZED,
      },
    ]);
  });

  it('wires a controller that disables an account', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.disableAccount('founder');

    expect(http.calls.map(({ method, url }) => `${method} ${url}`)).toEqual([
      'post companies/c1/accounts/founder/disable',
    ]);
  });

  it('wires a controller that restores an account', async () => {
    const { deps, http } = compositionFor();

    await deps.controller.restoreAccount('founder');

    expect(http.calls.map(({ method, url }) => `${method} ${url}`)).toEqual([
      'post companies/c1/accounts/founder/restore',
    ]);
  });

  it('provides the presenters the screen needs', () => {
    const { deps } = compositionFor();

    expect(deps.presenter.present([founder]).rows).toHaveLength(1);
    expect(deps.errorPresenter.present(new Error(ErrorCode.ACCESS_DENIED))).toBe(
      i18n.messages.errors.ACCESS_DENIED,
    );
  });

  it('refuses to reach the api when nobody is signed in', async () => {
    const { deps, http } = compositionFor(null);

    await expect(deps.controller.listAccounts()).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
    expect(http.calls).toEqual([]);
  });
});
