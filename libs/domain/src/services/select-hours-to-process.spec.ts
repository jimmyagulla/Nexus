import { HoursFact } from '../facts/hours-fact';
import { HoursFactStatus } from '../facts/hours-fact-status';
import { CalendarDate } from '../value-objects/calendar-date';
import { PresenceMonth } from '../value-objects/presence-month';
import { selectHoursToProcess } from './select-hours-to-process';

const october = PresenceMonth.parse('2026-10');

function fact(
  id: string,
  date: string,
  status: HoursFactStatus,
  employeeId = 'e1',
): HoursFact {
  return {
    id,
    companyId: 'c1',
    employeeId,
    date: CalendarDate.parse(date),
    hours: 2,
    sourceDeclarationId: `d-${id}`,
    status,
  };
}

describe('selectHoursToProcess', () => {
  it('selects the validated hours dated in the month', () => {
    const selected = selectHoursToProcess(october, [
      fact('h1', '2026-10-12', HoursFactStatus.VALIDATED),
      fact('h2', '2026-10-30', HoursFactStatus.VALIDATED),
    ]);

    expect(selected.map((entry) => entry.id)).toEqual(['h1', 'h2']);
  });

  it('leaves out the hours that are already processed', () => {
    const selected = selectHoursToProcess(october, [
      fact('h1', '2026-10-12', HoursFactStatus.PROCESSED),
      fact('h2', '2026-10-13', HoursFactStatus.VALIDATED),
    ]);

    expect(selected.map((entry) => entry.id)).toEqual(['h2']);
  });

  it('leaves out the validated hours of another month', () => {
    const selected = selectHoursToProcess(october, [
      fact('h1', '2026-09-30', HoursFactStatus.VALIDATED),
      fact('h2', '2026-11-01', HoursFactStatus.VALIDATED),
    ]);

    expect(selected).toEqual([]);
  });

  it('selects nothing when there is no fact', () => {
    expect(selectHoursToProcess(october, [])).toEqual([]);
  });
});
