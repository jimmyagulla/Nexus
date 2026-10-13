import {
  CryptoRecoveryCodes,
  FixedClock,
  InMemorySecondFactorRepository,
  TotpSecondFactorCodes,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  RECOVERY_CODE_COUNT,
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
const recovery = new CryptoRecoveryCodes();

async function pendingEnrollment() {
  const factors = new InMemorySecondFactorRepository();
  await factors.save(SecondFactor.begin('u1', 'c1', SECRET));
  const useCase = new ConfirmSecondFactorEnrollmentUseCase(
    factors,
    new TotpSecondFactorCodes(),
    recovery,
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

    expect(result.enrolled).toBe(true);
    expect((await factors.findByUserId('u1'))?.isEnrolled()).toBe(true);
  });

  it('hands over the recovery codes of the enrollment', async () => {
    const { useCase } = await pendingEnrollment();

    const result = await useCase.execute({
      actor: employee,
      code: await computeTotp(SECRET, now.getTime()),
    });

    expect(result.recoveryCodes).toHaveLength(RECOVERY_CODE_COUNT);
  });

  it('keeps only the digests of the recovery codes it handed over', async () => {
    const { factors, useCase } = await pendingEnrollment();

    const { recoveryCodes } = await useCase.execute({
      actor: employee,
      code: await computeTotp(SECRET, now.getTime()),
    });

    const stored = (await factors.findByUserId('u1'))?.recoveryCodeDigests;
    expect(stored).toEqual(
      await Promise.all(recoveryCodes.map((code) => recovery.digest(code))),
    );
    expect(stored?.filter((digest) => recoveryCodes.includes(digest))).toEqual(
      [],
    );
  });

  it('leaves the enrollment unfinished and hands over nothing with an invalid code', async () => {
    const { factors, useCase } = await pendingEnrollment();

    await expect(
      useCase.execute({ actor: employee, code: '000000' }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);
    const stored = await factors.findByUserId('u1');
    expect(stored?.isEnrolled()).toBe(false);
    expect(stored?.recoveryCodeDigests).toEqual([]);
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
      recovery,
      new FixedClock(now),
    );

    await expect(
      useCase.execute({
        actor: employee,
        code: await computeTotp(SECRET, now.getTime()),
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('never shows the recovery codes a second time', async () => {
    const { useCase } = await pendingEnrollment();
    const code = await computeTotp(SECRET, now.getTime());
    await useCase.execute({ actor: employee, code });

    await expect(useCase.execute({ actor: employee, code })).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
