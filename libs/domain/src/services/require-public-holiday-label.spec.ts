import { ErrorCode } from '../errors/error-code';
import { requirePublicHolidayLabel } from './require-public-holiday-label';

describe('requirePublicHolidayLabel', () => {
  it('trims the surrounding spaces', () => {
    expect(requirePublicHolidayLabel('  Bastille Day  ')).toBe('Bastille Day');
  });

  it('refuses a label made of spaces', () => {
    expect(() => requirePublicHolidayLabel('   ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses an empty label', () => {
    expect(() => requirePublicHolidayLabel('')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
