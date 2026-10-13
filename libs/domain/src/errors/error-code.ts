export const ErrorCode = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  REQUIRED_INFORMATION: 'REQUIRED_INFORMATION',
  POTENTIAL_DUPLICATE: 'POTENTIAL_DUPLICATE',
  INVITATION_INVALID: 'INVITATION_INVALID',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  SECOND_FACTOR_REQUIRED: 'SECOND_FACTOR_REQUIRED',
  EMPLOYEE_INACTIVE: 'EMPLOYEE_INACTIVE',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export function isErrorCode(value: string): value is ErrorCode {
  return Object.values(ErrorCode).includes(value as ErrorCode);
}
