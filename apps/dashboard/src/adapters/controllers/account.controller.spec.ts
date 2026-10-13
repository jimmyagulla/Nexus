import { describe, expect, it } from 'vitest';
import {
  ApiAccountGateway,
  InMemoryHttpClient,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActivateAccountViaGatewayUseCase,
  ActivateEmployeeAccountViaGatewayUseCase,
  SignInViaGatewayUseCase,
} from '@hexagonal-monorepo-template/application';
import { AccountController } from './account.controller';

function controllerOver(http: InMemoryHttpClient): AccountController {
  const gateway = new ApiAccountGateway(http);
  return new AccountController(
    new ActivateAccountViaGatewayUseCase(gateway),
    new ActivateEmployeeAccountViaGatewayUseCase(gateway),
    new SignInViaGatewayUseCase(gateway),
  );
}

describe('AccountController', () => {
  it('activates the account with the invitation and the chosen secret', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/activation', { status: 201, data: null });

    await controllerOver(http).activate('invite-1', 's3cret');

    expect(http.calls[0]?.data).toEqual({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });

  it('activates the employee account through the employee route', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/employee-activation', {
      status: 201,
      data: null,
    });

    await controllerOver(http).activateEmployee('invite-1', 's3cret');

    expect(http.calls[0]?.url).toBe('accounts/employee-activation');
    expect(http.calls[0]?.data).toEqual({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });
});
