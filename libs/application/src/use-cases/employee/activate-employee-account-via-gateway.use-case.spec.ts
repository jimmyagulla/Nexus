import {
  ApiAccountGateway,
  InMemoryHttpClient,
} from '@hexagonal-monorepo-template/adapters';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { ActivateEmployeeAccountViaGatewayUseCase } from './activate-employee-account-via-gateway.use-case';

describe('ActivateEmployeeAccountViaGatewayUseCase', () => {
  it('hands the invitation and the secret to the account gateway', async () => {
    const http = new InMemoryHttpClient();
    http.reply('post', 'accounts/employee-activation', {
      status: 201,
      data: null,
    });
    const useCase = new ActivateEmployeeAccountViaGatewayUseCase(
      new ApiAccountGateway(http),
    );

    await useCase.execute({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });

    expect(http.calls[0]?.url).toBe('accounts/employee-activation');
    expect(http.calls[0]?.data).toEqual({
      invitationToken: 'invite-1',
      secret: 's3cret',
    });
  });

  it('lets the refusal of the server reach its caller', async () => {
    const http = new InMemoryHttpClient();
    http.reject(
      'post',
      'accounts/employee-activation',
      new Error(ErrorCode.INVITATION_INVALID),
    );
    const useCase = new ActivateEmployeeAccountViaGatewayUseCase(
      new ApiAccountGateway(http),
    );

    await expect(
      useCase.execute({ invitationToken: 'invite-1', secret: 's3cret' }),
    ).rejects.toThrow(ErrorCode.INVITATION_INVALID);
  });
});
