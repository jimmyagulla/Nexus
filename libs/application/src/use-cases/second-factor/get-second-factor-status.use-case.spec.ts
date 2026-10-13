import { InMemorySecondFactorRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  SecondFactor,
  SecondFactorStep,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetSecondFactorStatusUseCase } from './get-second-factor-status.use-case';

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

describe('GetSecondFactorStatusUseCase', () => {
  it('leads an employee without enrollment to the enrollment', async () => {
    const useCase = new GetSecondFactorStatusUseCase(
      new InMemorySecondFactorRepository(),
    );

    await expect(useCase.execute({ actor: employee })).resolves.toEqual({
      step: SecondFactorStep.ENROLL,
    });
  });

  it('keeps leading an employee whose enrollment is unfinished to the enrollment', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', 'SECRET'));

    await expect(
      new GetSecondFactorStatusUseCase(factors).execute({ actor: employee }),
    ).resolves.toEqual({ step: SecondFactorStep.ENROLL });
  });

  it('asks an enrolled employee who has not verified for the second factor', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', 'SECRET').confirm([]));

    await expect(
      new GetSecondFactorStatusUseCase(factors).execute({ actor: employee }),
    ).resolves.toEqual({ step: SecondFactorStep.VERIFY });
  });

  it('opens the space of an employee whose second factor is verified', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', 'SECRET').confirm([]));

    await expect(
      new GetSecondFactorStatusUseCase(factors).execute({
        actor: { ...employee, secondFactorVerified: true },
      }),
    ).resolves.toEqual({ step: SecondFactorStep.NONE });
  });

  it.each([UserRole.EMPLOYER, UserRole.ACCOUNTANT])(
    'asks nothing from a %s',
    async (role) => {
      await expect(
        new GetSecondFactorStatusUseCase(
          new InMemorySecondFactorRepository(),
        ).execute({ actor: { ...employee, role } }),
      ).resolves.toEqual({ step: SecondFactorStep.NONE });
    },
  );
});
