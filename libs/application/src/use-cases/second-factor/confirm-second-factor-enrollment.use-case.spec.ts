import {
  FixedClock,
  InMemorySecondFactorRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  SecondFactor,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { computeTotp } from '@hexagonal-monorepo-template/infrastructure';
import { ConfirmSecondFactorEnrollmentUseCase } from './confirm-second-factor-enrollment.use-case';

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};
const SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const now = new Date(59_000);

async function pendingEnrollment() {
  const factors = new InMemorySecondFactorRepository();
  await factors.save(SecondFactor.begin('u1', 'c1', SECRET));
  const useCase = new ConfirmSecondFactorEnrollmentUseCase(
    factors,
    new TotpSecondFactorCodes(),
    new FixedClock(now),
  );
  return { factors, useCase };
}

describe('ConfirmSecondFactorEnrollmentUseCase', () => {
  it('finishes the enrollment with a valid code', async () => {
    const { factors, useCase } = await pendingEnrollment();

    const result = await useCase.execute({
      actor: employee,
      code: await computeTotp(SECRET, now.getTime()),
    });

    expect(result).toEqual({ enrolled: true });
    expect((await factors.findByUserId('u1'))?.isEnrolled()).toBe(true);
  });

  it('leaves the enrollment unfinished with an invalid code', async () => {
    const { factors, useCase } = await pendingEnrollment();

    await expect(
      useCase.execute({ actor: employee, code: '000000' }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);
    expect((await factors.findByUserId('u1'))?.isEnrolled()).toBe(false);
  });

  it('lets the employee try again after an invalid code', async () => {
    const { factors, useCase } = await pendingEnrollment();
    await expect(
      useCase.execute({ actor: employee, code: '000000' }),
    ).rejects.toThrow();

    await useCase.execute({
      actor: employee,
      code: await computeTotp(SECRET, now.getTime()),
    });

    expect((await factors.findByUserId('u1'))?.isEnrolled()).toBe(true);
  });

  it('asks for the code when it is empty', async () => {
    const { useCase } = await pendingEnrollment();

    await expect(
      useCase.execute({ actor: employee, code: '  ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses an employee who never started the enrollment', async () => {
    const useCase = new ConfirmSecondFactorEnrollmentUseCase(
      new InMemorySecondFactorRepository(),
      new TotpSecondFactorCodes(),
      new FixedClock(now),
    );

    await expect(
      useCase.execute({
        actor: employee,
        code: await computeTotp(SECRET, now.getTime()),
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an enrollment that is already finished', async () => {
    const { factors, useCase } = await pendingEnrollment();
    await factors.save(SecondFactor.begin('u1', 'c1', SECRET).confirm());

    await expect(
      useCase.execute({
        actor: employee,
        code: await computeTotp(SECRET, now.getTime()),
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
