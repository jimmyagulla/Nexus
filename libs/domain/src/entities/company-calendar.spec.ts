import { describe, expect, it } from 'vitest';
import { ErrorMessage } from '../errors/error-message';
import { Company } from './company';
import { CompanyCalendar } from './company-calendar';
import { Weekday } from '../value-objects/weekday';

describe('CompanyCalendar', () => {
  it('adds a dated public holiday', () => {
    const company = Company.create('Acme');
    const updated = CompanyCalendar.addHoliday(company, '2026-07-14', 'Fête nationale');

    expect(updated.holidays).toHaveLength(1);
    expect(updated.holidays[0]?.date).toBe('2026-07-14');
    expect(updated.holidays[0]?.label).toBe('Fête nationale');
  });

  it('removes a holiday from the calendar', () => {
    const withHoliday = CompanyCalendar.addHoliday(
      Company.create('Acme'),
      '2026-07-14',
      'Fête nationale',
    );
    const holidayId = withHoliday.holidays[0]?.id ?? '';
    const updated = CompanyCalendar.removeHoliday(withHoliday, holidayId);

    expect(updated.holidays).toEqual([]);
  });

  it('updates non-working weekdays', () => {
    const company = Company.create('Acme');
    const updated = CompanyCalendar.setNonWorkingWeekdays(company, [
      Weekday.FRIDAY,
      Weekday.SATURDAY,
    ]);

    expect(updated.nonWorkingWeekdays).toEqual([Weekday.FRIDAY, Weekday.SATURDAY]);
  });

  it('rejects an empty holiday label', () => {
    expect(() =>
      CompanyCalendar.addHoliday(Company.create('Acme'), '2026-07-14', '  '),
    ).toThrow(Error);
    try {
      CompanyCalendar.addHoliday(Company.create('Acme'), '2026-07-14', '');
    } catch (error) {
      expect((error as Error).message).toBe(ErrorMessage.INFORMATION_OBLIGATOIRE);
    }
  });
});
