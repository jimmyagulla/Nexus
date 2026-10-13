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
import { GetSecondFactorStatusFromSessionUseCase } from './get-second-factor-status-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('get', 'second-factor/status', {
    status: 200,
    data: { step: SecondFactorStep.ENROLL },
  });
  return new GetSecondFactorStatusFromSessionUseCase(
    session,
    new ApiSecondFactorGateway(http),
  );
}

describe('GetSecondFactorStatusFromSessionUseCase', () => {
  it('reads the status of the signed-in user', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual({
      step: SecondFactorStep.ENROLL,
    });
  });

  it('leaves the session as it is', async () => {
    const session = new InMemorySessionGateway('token', actor);

    await useCaseFor(session).execute();

    expect(session.refreshes).toBe(0);
  });

  it('refuses when there is no session', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, null));

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
