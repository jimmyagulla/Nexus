import { PublicHoliday } from '../entities/public-holiday';
import { CalendarDate } from '../value-objects/calendar-date';
import { toPublicHolidayAuditSnapshot } from './to-public-holiday-audit-snapshot';

describe('toPublicHolidayAuditSnapshot', () => {
  it('records the identity, the day and the label of a public holiday', () => {
    const publicHoliday = new PublicHoliday(
      'ph-1',
      CalendarDate.parse('2026-07-14'),
      'Bastille Day',
    );

    expect(toPublicHolidayAuditSnapshot(publicHoliday)).toEqual({
      publicHolidayId: 'ph-1',
      holidayDate: '2026-07-14',
      holidayLabel: 'Bastille Day',
    });
  });

  it('records the label as retained, without reformatting it', () => {
    const publicHoliday = new PublicHoliday(
      'ph-1',
      CalendarDate.parse('2026-01-01'),
      "Jour  de l'An",
    );

    expect(toPublicHolidayAuditSnapshot(publicHoliday).holidayLabel).toBe(
      "Jour  de l'An",
    );
  });
});
