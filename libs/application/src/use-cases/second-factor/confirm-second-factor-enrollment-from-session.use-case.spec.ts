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
import { ConfirmSecondFactorEnrollmentFromSessionUseCase } from './confirm-second-factor-enrollment-from-session.use-case';

const actor: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function useCaseFor(session: InMemorySessionGateway) {
  const http = new InMemoryHttpClient();
  http.reply('post', 'second-factor/enrollment/confirmation', {
    status: 201,
    data: { enrolled: true, recoveryCodes: ['ABCDE23456'] },
  });
  return new ConfirmSecondFactorEnrollmentFromSessionUseCase(
    session,
    new ApiSecondFactorGateway(http),
  );
}

describe('ConfirmSecondFactorEnrollmentFromSessionUseCase', () => {
  it('confirms the enrollment of the signed-in employee', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway('token', actor));

    await expect(useCase.execute('123456')).resolves.toEqual({
      enrolled: true,
      recoveryCodes: ['ABCDE23456'],
    });
  });

  it('refuses when there is no session', async () => {
    const useCase = useCaseFor(new InMemorySessionGateway(null, null));

    await expect(useCase.execute('123456')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
