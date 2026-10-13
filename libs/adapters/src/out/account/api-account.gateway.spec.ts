import { describe, expect, it } from 'vitest';
import { InMemoryHttpClient } from '../http/in-memory-http-client';
import { ApiAccountGateway } from './api-account.gateway';

describe('ApiAccountGateway', () => {
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

  it('posts the employee invitation and the chosen secret to the employee route', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/employee-activation', {
      status: 201,
      data: null,
    });
    const gateway = new ApiAccountGateway(http);

    await gateway.activateEmployee({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });

    expect(http.calls).toEqual([
      {
        method: 'post',
        url: 'accounts/employee-activation',
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
