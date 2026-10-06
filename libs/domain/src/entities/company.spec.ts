import { DayOfWeek } from '../value-objects/day-of-week';
import { CompanyName } from '../value-objects/company-name';
import { Company } from './company';

describe('Company', () => {
  it('opens with the default calendar', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));

    expect(company.id).toBe('c1');
    expect(company.name.value).toBe('Acme');
    expect(company.calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
  });

  it('keeps its identity and its calendar when it is renamed', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));

    const renamed = company.rename(CompanyName.parse('Nexus'));

    expect(renamed.id).toBe('c1');
    expect(renamed.name.value).toBe('Nexus');
    expect(renamed.calendar).toBe(company.calendar);
  });

  it('leaves the previous name untouched when it is renamed', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));

    company.rename(CompanyName.parse('Nexus'));

    expect(company.name.value).toBe('Acme');
  });

  it('keeps its identity and its name when its calendar changes', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));
    const calendar = company.calendar.withNonWorkingWeekdays([DayOfWeek.SUNDAY]);

    const updated = company.withCalendar(calendar);

    expect(updated.id).toBe('c1');
    expect(updated.name.value).toBe('Acme');
    expect(updated.calendar.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
  });

  it('leaves the previous calendar untouched when its calendar changes', () => {
    const company = Company.create('c1', CompanyName.parse('Acme'));

    company.withCalendar(
      company.calendar.withNonWorkingWeekdays([DayOfWeek.SUNDAY]),
    );

    expect(company.calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
  });
});
