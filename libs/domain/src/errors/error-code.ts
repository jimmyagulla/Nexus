export const ErrorCode = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  REQUIRED_INFORMATION: 'REQUIRED_INFORMATION',
  POTENTIAL_DUPLICATE: 'POTENTIAL_DUPLICATE',
  INVALID_INFORMATION: 'INVALID_INFORMATION',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_FORMAT: 'UNSUPPORTED_FILE_FORMAT',
  ALREADY_PROCESSED: 'ALREADY_PROCESSED',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export function isErrorCode(value: string): value is ErrorCode {
  return Object.values(ErrorCode).includes(value as ErrorCode);
}
