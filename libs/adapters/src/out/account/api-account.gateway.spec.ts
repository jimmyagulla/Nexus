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
});
