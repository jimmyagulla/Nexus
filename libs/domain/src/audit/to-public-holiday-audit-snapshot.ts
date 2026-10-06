import { PublicHoliday } from '../entities/public-holiday';
import { AuditSnapshot } from './audit-snapshot';

export function toPublicHolidayAuditSnapshot(
  publicHoliday: PublicHoliday,
): AuditSnapshot {
  return {
    publicHolidayId: publicHoliday.id,
    holidayDate: publicHoliday.date.value,
    holidayLabel: publicHoliday.label,
  };
}
