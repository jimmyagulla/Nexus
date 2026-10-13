import {
  CryptoRecoveryCodes,
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
import { VerifySecondFactorUseCase } from './verify-second-factor.use-case';

const employee: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};
const SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
const now = new Date(59_000);
const recovery = new CryptoRecoveryCodes();

async function enrolledEmployee(recoveryCodes: readonly string[] = []) {
  const factors = new InMemorySecondFactorRepository();
  await factors.save(
    SecondFactor.begin('u1', 'c1', SECRET).confirm(
      await Promise.all(recoveryCodes.map((code) => recovery.digest(code))),
    ),
  );
  const useCase = new VerifySecondFactorUseCase(
    factors,
    new TotpSecondFactorCodes(),
    recovery,
    new FixedClock(now),
  );
  return { factors, useCase };
}

describe('VerifySecondFactorUseCase', () => {
  it('verifies the usual code', async () => {
    const { useCase } = await enrolledEmployee();

    await expect(
      useCase.execute({
        actor: employee,
        code: await computeTotp(SECRET, now.getTime()),
      }),
    ).resolves.toEqual({ verified: true });
  });

  it('refuses a wrong usual code', async () => {
    const { useCase } = await enrolledEmployee();

    await expect(
      useCase.execute({ actor: employee, code: '000000' }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);
  });

  it('verifies a recovery code in place of the usual code', async () => {
    const { useCase } = await enrolledEmployee(['ABCDE23456']);

    await expect(
      useCase.execute({ actor: employee, code: 'ABCDE-23456' }),
    ).resolves.toEqual({ verified: true });
  });

  it('spends the recovery code it verified', async () => {
    const { factors, useCase } = await enrolledEmployee([
      'ABCDE23456',
      'FGHIJ23456',
    ]);

    await useCase.execute({ actor: employee, code: 'ABCDE23456' });

    expect((await factors.findByUserId('u1'))?.recoveryCodeDigests).toEqual([
      await recovery.digest('FGHIJ23456'),
    ]);
  });

  it('refuses a recovery code already used', async () => {
    const { useCase } = await enrolledEmployee(['ABCDE23456']);
    await useCase.execute({ actor: employee, code: 'ABCDE23456' });

    await expect(
      useCase.execute({ actor: employee, code: 'ABCDE23456' }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);
  });

  it('refuses a recovery code that was never issued', async () => {
    const { useCase } = await enrolledEmployee(['ABCDE23456']);

    await expect(
      useCase.execute({ actor: employee, code: 'ZZZZZ22222' }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);
  });

  it('keeps the recovery codes when the usual code is wrong', async () => {
    const { factors, useCase } = await enrolledEmployee(['ABCDE23456']);

    await expect(
      useCase.execute({ actor: employee, code: '000000' }),
    ).rejects.toThrow();

    expect((await factors.findByUserId('u1'))?.recoveryCodeDigests).toHaveLength(
      1,
    );
  });

  it('asks for the code when it is empty', async () => {
    const { useCase } = await enrolledEmployee();

    await expect(
      useCase.execute({ actor: employee, code: '  ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('requires the second factor from an employee who is not enrolled', async () => {
    const factors = new InMemorySecondFactorRepository();
    await factors.save(SecondFactor.begin('u1', 'c1', SECRET));
    const useCase = new VerifySecondFactorUseCase(
      factors,
      new TotpSecondFactorCodes(),
      recovery,
      new FixedClock(now),
    );

    await expect(
      useCase.execute({
        actor: employee,
        code: await computeTotp(SECRET, now.getTime()),
      }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);
  });

  it('requires the second factor from an employee without enrollment', async () => {
    const useCase = new VerifySecondFactorUseCase(
      new InMemorySecondFactorRepository(),
      new TotpSecondFactorCodes(),
      recovery,
      new FixedClock(now),
    );

    await expect(
      useCase.execute({ actor: employee, code: '123456' }),
    ).rejects.toThrow(ErrorCode.SECOND_FACTOR_REQUIRED);
  });
});
