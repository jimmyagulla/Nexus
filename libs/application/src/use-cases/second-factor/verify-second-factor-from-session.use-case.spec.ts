import {
  ApiSecondFactorGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { VerifySecondFactorFromSessionUseCase } from './verify-second-factor-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function useCaseFor(session: InMemorySessionGateway, refuse = false) {
  const http = new InMemoryHttpClient();
  if (refuse) {
    http.reject(
      'post',
      'second-factor/verification',
      new Error(ErrorCode.SECOND_FACTOR_REQUIRED),
    );
  } else {
    http.reply('post', 'second-factor/verification', {
      status: 201,
      data: { verified: true },
    });
  }
  return new VerifySecondFactorFromSessionUseCase(
    session,
    new ApiSecondFactorGateway(http),
  );
}

describe('VerifySecondFactorFromSessionUseCase', () => {
  it('verifies the second factor of the signed-in user', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('123456')).resolves.toEqual({
      verified: true,
    });
  });

  it('refreshes the session so it carries the verification', async () => {
    const session = new InMemorySessionGateway('token', actor);

    await useCaseFor(session).execute('123456');

    expect(session.refreshes).toBe(1);
  });

  it('keeps the session as it was when the code is refused', async () => {
    const session = new InMemorySessionGateway('token', actor);

    await expect(useCaseFor(session, true).execute('000000')).rejects.toThrow(
      ErrorCode.SECOND_FACTOR_REQUIRED,
    );
    expect(session.refreshes).toBe(0);
  });

  it('refuses when there is no session', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, null));

    await expect(useCase.execute('123456')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
