export const SecondFactorEnrollmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
} as const;

export type SecondFactorEnrollmentStatus =
  (typeof SecondFactorEnrollmentStatus)[keyof typeof SecondFactorEnrollmentStatus];

const VALUES = new Set<string>(Object.values(SecondFactorEnrollmentStatus));

export function isSecondFactorEnrollmentStatus(
  value: string,
): value is SecondFactorEnrollmentStatus {
  return VALUES.has(value);
}
