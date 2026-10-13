import {
  SecondFactorEnrollment,
  SecondFactorEnrollmentStatus,
} from '@hexagonal-monorepo-template/domain';

export type PrismaSecondFactorEnrollmentRow = {
  id: string;
  accountId: string;
  secret: string;
  status: SecondFactorEnrollmentStatus;
};

export function toSecondFactorEnrollment(
  row: PrismaSecondFactorEnrollmentRow,
): SecondFactorEnrollment {
  return new SecondFactorEnrollment(
    row.id,
    row.accountId,
    row.secret,
    row.status,
  );
}
