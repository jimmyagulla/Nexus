import { InMemorySessionGateway } from '@hexagonal-monorepo-template/adapters';
import { UserRole } from '@hexagonal-monorepo-template/domain';
import { GetCurrentRoleFromSessionUseCase } from './get-current-role-from-session.use-case';

describe('GetCurrentRoleFromSessionUseCase', () => {
  it('gives the role of the signed-in actor', async () => {
    const useCase = new GetCurrentRoleFromSessionUseCase(
      new InMemorySessionGateway('token', {
        userId: 'u1',
        companyId: 'c1',
        role: UserRole.ACCOUNTANT,
      }),
    );

    await expect(useCase.execute()).resolves.toBe(UserRole.ACCOUNTANT);
  });

  it('gives no role when nobody is signed in', async () => {
    const useCase = new GetCurrentRoleFromSessionUseCase(
      new InMemorySessionGateway(null, null),
    );

    await expect(useCase.execute()).resolves.toBeNull();
  });

  it('gives no role to an actor whose role is unknown', async () => {
    const useCase = new GetCurrentRoleFromSessionUseCase(
      new InMemorySessionGateway('token', {
        userId: 'u1',
        companyId: 'c1',
        role: null,
      }),
    );

    await expect(useCase.execute()).resolves.toBeNull();
  });
});
