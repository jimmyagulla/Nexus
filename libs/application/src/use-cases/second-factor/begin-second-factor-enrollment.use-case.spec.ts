import {
  InMemorySecondFactorRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  SecondFactor,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { BeginSecondFactorEnrollmentUseCase } from './begin-second-factor-enrollment.use-case';

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function useCaseOver(factors: InMemorySecondFactorRepository) {
  return new BeginSecondFactorEnrollmentUseCase(
    factors,
    new TotpSecondFactorCodes(),
  );
}

describe('BeginSecondFactorEnrollmentUseCase', () => {
  it('hands the employee a secret to enrol and keeps the enrollment unfinished', async () => {
    const factors = new InMemorySecondFactorRepository();

    const enrollment = await useCaseOver(factors).execute({ actor: employee });

    const stored = await factors.findByUserId('u1');
    expect(stored?.isEnrolled()).toBe(false);
    expect(stored?.companyId).toBe('c1');
    expect(enrollment.secret).toBe(stored?.secret);
    expect(enrollment.provisioningUri).toBe(
      `otpauth://totp/Nexus:u1?secret=${enrollment.secret}&issuer=Nexus`,
    );
  });

  it('hands back the same secret while the enrollment is unfinished', async () => {
    const factors = new InMemorySecondFactorRepository();
    const useCase = useCaseOver(factors);

    const first = await useCase.execute({ actor: employee });
    const second = await useCase.execute({ actor: employee });

    expect(second.secret).toBe(first.secret);
  });

  it('refuses an employee who is already enrolled', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', 'SECRET').confirm([]));

    await expect(
      useCaseOver(factors).execute({ actor: employee }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await factors.findByUserId('u1'))?.secret).toBe('SECRET');
  });

  it.each([UserRole.EMPLOYER, UserRole.ACCOUNTANT])(
    'refuses a %s, who does not enrol',
    async (role) => {
      const factors = new InMemorySecondFactorRepository();

      await expect(
        useCaseOver(factors).execute({ actor: { ...employee, role } }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect(await factors.findByUserId('u1')).toBeNull();
    },
  );

  it('refuses an actor without company', async () => {
    await expect(
      useCaseOver(new InMemorySecondFactorRepository()).execute({
        actor: { ...employee, companyId: null },
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
