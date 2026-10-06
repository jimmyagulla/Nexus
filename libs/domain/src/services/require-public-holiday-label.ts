import { ErrorCode } from '../errors/error-code';

export function requirePublicHolidayLabel(raw: string): string {
  const label = raw.trim();
  if (label === '') {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }

  return label;
}
