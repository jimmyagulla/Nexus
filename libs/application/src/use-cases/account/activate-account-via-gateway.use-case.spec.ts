import {
  ApiAccountGateway,
  InMemoryHttpClient,
} from '@hexagonal-monorepo-template/adapters';
import { ActivateAccountViaGatewayUseCase } from './activate-account-via-gateway.use-case';

describe('ActivateAccountViaGatewayUseCase', () => {
  it('hands the invitation and the secret to the account gateway', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/activation', { status: 201, data: null });
    const useCase = new ActivateAccountViaGatewayUseCase(
      new ApiAccountGateway(http),
    );

    await useCase.execute({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });

    expect(http.calls[0]?.data).toEqual({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });
});
