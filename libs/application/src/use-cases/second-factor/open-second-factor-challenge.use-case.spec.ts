import {
  InMemorySecondFactorIdentityBinder,
  InMemorySecondFactorRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  SecondFactor,
  SecondFactorStep,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { OpenSecondFactorChallengeUseCase } from './open-second-factor-challenge.use-case';

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function useCaseOver(
  factors: InMemorySecondFactorRepository,
  identity: InMemorySecondFactorIdentityBinder,
) {
  return new OpenSecondFactorChallengeUseCase(factors, identity);
}

describe('OpenSecondFactorChallengeUseCase', () => {
  it('sends an employee who is not enrolled to the enrollment', async () => {
    const useCase = useCaseOver(
      new InMemorySecondFactorRepository(),
      new InMemorySecondFactorIdentityBinder(),
    );

    await expect(useCase.execute({ actor: employee })).resolves.toEqual({
      step: SecondFactorStep.ENROLL,
    });
  });

  it('sends an employee whose enrollment is unfinished to the enrollment', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', 'SECRET'));

    await expect(
      useCaseOver(factors, new InMemorySecondFactorIdentityBinder()).execute({
        actor: employee,
      }),
    ).resolves.toEqual({ step: SecondFactorStep.ENROLL });
  });

  it('asks an enrolled employee for the second factor', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', 'SECRET').confirm([]));

    await expect(
      useCaseOver(factors, new InMemorySecondFactorIdentityBinder()).execute({
        actor: employee,
      }),
    ).resolves.toEqual({ step: SecondFactorStep.VERIFY });
  });

  it('forgets the verification of the previous connection', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', 'SECRET').confirm([]));
    const identity = new InMemorySecondFactorIdentityBinder();
    await identity.markVerified('u1');

    await useCaseOver(factors, identity).execute({
      actor: { ...employee, secondFactorVerified: true },
    });

    expect(identity.verified.has('u1')).toBe(false);
  });

  it.each([UserRole.EMPLOYER, UserRole.ACCOUNTANT])(
    'asks nothing from a %s',
    async (role) => {
      const identity = new InMemorySecondFactorIdentityBinder();
      await identity.markVerified('u1');

      await expect(
        useCaseOver(new InMemorySecondFactorRepository(), identity).execute({
          actor: { ...employee, role },
        }),
      ).resolves.toEqual({ step: SecondFactorStep.NONE });
      expect(identity.verified.has('u1')).toBe(true);
    },
  );
});
