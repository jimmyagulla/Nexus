import { describe, expect, it } from 'vitest';
import {
  ApiAccountGateway,
  InMemoryHttpClient,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActivateAccountViaGatewayUseCase,
  SignInViaGatewayUseCase,
} from '@hexagonal-monorepo-template/application';
import { AccountController } from './account.controller';

describe('AccountController', () => {
  it('activates the account with the invitation and the chosen secret', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/activation', { status: 201, data: null });
    const gateway = new ApiAccountGateway(http);
    const controller = new AccountController(
      new ActivateAccountViaGatewayUseCase(gateway),
      new SignInViaGatewayUseCase(gateway),
    );

    await controller.activate('invite-1', 's3cret');

    expect(http.calls[0]?.data).toEqual({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });
});
