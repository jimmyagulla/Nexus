export const ErrorCode = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  REQUIRED_INFORMATION: 'REQUIRED_INFORMATION',
  POTENTIAL_DUPLICATE: 'POTENTIAL_DUPLICATE',
  INVALID_FILE: 'INVALID_FILE',
  MISSING_DOCUMENT: 'MISSING_DOCUMENT',
  TRANSMISSION_FAILED: 'TRANSMISSION_FAILED',
  INACCESSIBLE_DOCUMENT: 'INACCESSIBLE_DOCUMENT',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export function isErrorCode(value: string): value is ErrorCode {
  return Object.values(ErrorCode).includes(value as ErrorCode);
}
