import { ErrorCode } from '../errors/error-code';

/** A text that must be filled: trimmed, refused when blank. */
export function requireText(raw: string): string {
  const value = raw.trim();
  if (value === '') {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
  return value;
}

/** A value kept only when it meets its rule. */
export function requireValid<T>(value: T, valid: boolean): T {
  if (!valid) {
    throw new Error(ErrorCode.INVALID_INFORMATION);
  }
  return value;
}
