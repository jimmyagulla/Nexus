import { SecondFactor } from '@hexagonal-monorepo-template/domain';

export type PrismaSecondFactorRow = {
  userId: string;
  companyId: string;
  secret: string;
  enrolled: boolean;
  recoveryCodeDigests: string[];
};

export function toSecondFactor(row: PrismaSecondFactorRow): SecondFactor {
  return SecondFactor.restore({
    userId: row.userId,
    companyId: row.companyId,
    secret: row.secret,
    enrolled: row.enrolled,
    recoveryCodeDigests: row.recoveryCodeDigests,
  });
}

export function toPrismaSecondFactorData(
  factor: SecondFactor,
): PrismaSecondFactorRow {
  return {
    userId: factor.userId,
    companyId: factor.companyId,
    secret: factor.secret,
    enrolled: factor.isEnrolled(),
    recoveryCodeDigests: [...factor.recoveryCodeDigests],
  };
}
