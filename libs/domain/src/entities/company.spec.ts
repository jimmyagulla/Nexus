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
});
