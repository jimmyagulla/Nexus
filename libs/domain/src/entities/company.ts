import { CompanyCalendar } from './company-calendar';
import { CompanyName } from '../value-objects/company-name';

export class Company {
  constructor(
    readonly id: string,
    readonly name: CompanyName,
    readonly calendar: CompanyCalendar,
  ) {}

  static create(id: string, name: CompanyName): Company {
    return new Company(id, name, CompanyCalendar.default());
  }

  rename(name: CompanyName): Company {
    return new Company(this.id, name, this.calendar);
  }

  withCalendar(calendar: CompanyCalendar): Company {
    return new Company(this.id, this.name, calendar);
  }
}
