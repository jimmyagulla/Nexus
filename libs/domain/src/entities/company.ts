import { ErrorMessage } from '../errors/error-message';
import {
  DEFAULT_NON_WORKING_WEEKDAYS,
  type Weekday,
} from '../value-objects/weekday';
import { Holiday } from './holiday';

let companySequence = 0;

export class Company {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly nonWorkingWeekdays: readonly Weekday[],
    readonly holidays: readonly Holiday[],
  ) {}

  static create(name: string): Company {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      throw new Error(ErrorMessage.INFORMATION_OBLIGATOIRE);
    }
    companySequence += 1;
    return new Company(
      `company-${companySequence}`,
      trimmed,
      [...DEFAULT_NON_WORKING_WEEKDAYS],
      [],
    );
  }

  static restore(props: {
    id: string;
    name: string;
    nonWorkingWeekdays: readonly Weekday[];
    holidays: readonly Holiday[];
  }): Company {
    return new Company(
      props.id,
      props.name,
      props.nonWorkingWeekdays,
      props.holidays,
    );
  }

  rename(name: string): Company {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      throw new Error(ErrorMessage.INFORMATION_OBLIGATOIRE);
    }
    return new Company(
      this.id,
      trimmed,
      this.nonWorkingWeekdays,
      this.holidays,
    );
  }

  withNonWorkingWeekdays(weekdays: readonly Weekday[]): Company {
    return new Company(this.id, this.name, weekdays, this.holidays);
  }

  withHolidays(holidays: readonly Holiday[]): Company {
    return new Company(this.id, this.name, this.nonWorkingWeekdays, holidays);
  }
}
