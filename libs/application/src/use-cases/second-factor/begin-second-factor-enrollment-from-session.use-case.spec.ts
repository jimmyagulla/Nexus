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
import { BeginSecondFactorEnrollmentFromSessionUseCase } from './begin-second-factor-enrollment-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};
const enrollment = { secret: 'SECRET', provisioningUri: 'otpauth://x' };

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'second-factor/enrollment', {
    status: 201,
    data: enrollment,
  });
  return new BeginSecondFactorEnrollmentFromSessionUseCase(
    session,
    new ApiSecondFactorGateway(http),
  );
}

describe('BeginSecondFactorEnrollmentFromSessionUseCase', () => {
  it('begins the enrollment of the signed-in employee', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute()).resolves.toEqual(enrollment);
  });

  it('refuses when there is no session', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, null));

    await expect(useCase.execute()).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
