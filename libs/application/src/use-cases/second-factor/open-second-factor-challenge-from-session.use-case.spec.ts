import {
  ApiSecondFactorGateway,
  InMemoryHttpClient,
  InMemorySessionGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  SecondFactorStep,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { OpenSecondFactorChallengeFromSessionUseCase } from './open-second-factor-challenge-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'second-factor/challenge', {
    status: 201,
    data: { step: SecondFactorStep.VERIFY },
  });
  return new OpenSecondFactorChallengeFromSessionUseCase(
    session,
    new ApiSecondFactorGateway(http),
  );
}

describe('OpenSecondFactorChallengeFromSessionUseCase', () => {
  it('opens the challenge of the signed-in user', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual({
      step: SecondFactorStep.VERIFY,
    });
  });

  it('refreshes the session so it stops carrying the previous verification', async () => {
    const session = new InMemorySessionGateway('token', actor);

    await useCaseFor(session).execute();

    expect(session.refreshes).toBe(1);
  });

  it('refuses when there is no session', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, null));

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
