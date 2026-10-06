import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  Company,
  CompanyCalendar,
  CompanyName,
  CompanyPublicHoliday,
  CompanySettingsSnapshot,
  DayOfWeek,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';
import { toCompanySettingsResponse } from './company-settings.mapper';

const snapshot: CompanySettingsSnapshot = {
  id: 'company-1',
  name: 'Acme',
  nonWorkingWeekdays: [DayOfWeek.SUNDAY],
  publicHolidays: [{ id: 'holiday-1', date: '2026-07-14', label: 'Fête' }],
};

function companyEntity(): Company {
  return new Company(
    'company-1',
    CompanyName.parse('Acme'),
    new CompanyCalendar(
      [DayOfWeek.SUNDAY],
      [
        new CompanyPublicHoliday(
          'company-1',
          new PublicHoliday(
            'holiday-1',
            CalendarDate.parse('2026-07-14'),
            'Fête',
          ),
        ),
      ],
    ),
  );
}

describe('toCompanySettingsResponse', () => {
  it('flattens a company entity into the response shape', () => {
    expect(toCompanySettingsResponse(companyEntity())).toEqual({
      id: 'company-1',
      name: 'Acme',
      nonWorkingWeekdays: [DayOfWeek.SUNDAY],
      publicHolidays: [{ id: 'holiday-1', date: '2026-07-14', label: 'Fête' }],
    });
  });

  it('keeps a settings snapshot unchanged', () => {
    expect(toCompanySettingsResponse(snapshot)).toEqual(snapshot);
  });

  it('exposes a company without weekday nor holiday as empty lists', () => {
    const bare = new Company(
      'company-1',
      CompanyName.parse('Acme'),
      new CompanyCalendar([], []),
    );

    expect(toCompanySettingsResponse(bare)).toMatchObject({
      nonWorkingWeekdays: [],
      publicHolidays: [],
    });
  });

  it('detaches the weekday list from the source snapshot', () => {
    const response = toCompanySettingsResponse(snapshot);

    response.nonWorkingWeekdays.push(DayOfWeek.SATURDAY);

    expect(snapshot.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
  });

  it('detaches each holiday from the source snapshot', () => {
    const response = toCompanySettingsResponse(snapshot);

    const [holiday] = response.publicHolidays;
    holiday.label = 'renamed';

    expect(snapshot.publicHolidays[0]?.label).toBe('Fête');
  });
});
