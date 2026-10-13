import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiAccountGateway } from './api-account.gateway';

const AUTHORIZED = { headers: { Authorization: 'Bearer token' } };

const summary = {
  id: 'account-2',
  identifier: 'colleague',
  role: 'EMPLOYER',
  status: 'DISABLED',
  locked: false,
};

describe('ApiAccountGateway', () => {
  it('lists the accounts of a company with the session token', async () => {
    const http = new InMemoryHttpClient();
    http.reply('get', 'companies/c1/accounts', { status: 200, data: [summary] });

    await expect(
      new ApiAccountGateway(http).listByCompany('c1', 'token'),
    ).resolves.toEqual([summary]);
    expect(http.calls).toEqual([
      {
        method: 'get',
        url: 'companies/c1/accounts',
        data: undefined,
        config: AUTHORIZED,
      },
    ]);
  });

  it('invites an employer by identifier only', async () => {
    const http = new InMemoryHttpClient();
    const invited = { ...summary, status: 'INVITED', invitationToken: 'invite-2' };
    http.reply('post', 'companies/c1/accounts', { status: 201, data: invited });

    await expect(
      new ApiAccountGateway(http).invite('c1', 'colleague', 'token'),
    ).resolves.toEqual(invited);
    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'companies/c1/accounts',
        data: { identifier: 'colleague' },
        config: AUTHORIZED,
      },
    ]);
  });

  it('disables an account of the company', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'companies/c1/accounts/account-2/disable', {
      status: 201,
      data: summary,
    });

    await expect(
      new ApiAccountGateway(http).disable('c1', 'account-2', 'token'),
    ).resolves.toEqual(summary);
    expect(http.calls[0]).toMatchObject({
      method: 'post',
      url: 'companies/c1/accounts/account-2/disable',
      config: AUTHORIZED,
    });
  });

  it('restores an account of the company', async () => {
    const http = new InMemoryHttpClient();
    const active = { ...summary, status: 'ACTIVE' };
    http.reply('post', 'companies/c1/accounts/account-2/restore', {
      status: 201,
      data: active,
    });

    await expect(
      new ApiAccountGateway(http).restore('c1', 'account-2', 'token'),
    ).resolves.toEqual(active);
    expect(http.calls[0]).toMatchObject({
      method: 'post',
      url: 'companies/c1/accounts/account-2/restore',
      config: AUTHORIZED,
    });
  });

  it('posts the invitation and the chosen secret', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/activation', { status: 201, data: null });
    const gateway = new ApiAccountGateway(http);

    await gateway.activate({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'accounts/activation',
        data: { invitationToken: 'invite-1', secret: 's3cret' },
        config: undefined,
      },
    ]);
  });

  it('posts the identifier and the secret to sign in', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/sign-in', {
      status: 201,
      data: {
        accessToken: 'session:founder',
        companyId: 'company-1',
        role: 'EMPLOYER',
      },
    });
    const gateway = new ApiAccountGateway(http);

    await expect(
      gateway.signIn({ identifier: 'founder', secret: 's3cret' }),
    ).resolves.toEqual({
      accessToken: 'session:founder',
      companyId: 'company-1',
      role: 'EMPLOYER',
    });
  });
});
