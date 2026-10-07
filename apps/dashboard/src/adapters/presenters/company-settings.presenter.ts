import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../infrastructure/ui/i18n/i18n';

export interface WeekdayViewModel {
  value: DayOfWeek;
  label: string;
  selected: boolean;
}

export interface PublicHolidayViewModel {
  id: string;
  date: string;
  label: string;
}

export interface CompanySettingsViewModel {
  id: string;
  name: string;
  weekdays: WeekdayViewModel[];
  selectedWeekdays: DayOfWeek[];
  publicHolidays: PublicHolidayViewModel[];
}

export class CompanySettingsPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(snapshot: CompanySettingsSnapshot): CompanySettingsViewModel {
    return {
      id: snapshot.id,
      name: snapshot.name,
      weekdays: this.presentWeekdays(snapshot.nonWorkingWeekdays),
      selectedWeekdays: [...snapshot.nonWorkingWeekdays],
      publicHolidays: this.presentPublicHolidays(snapshot.publicHolidays),
    };
  }

  private presentWeekdays(
    nonWorkingWeekdays: readonly DayOfWeek[],
  ): WeekdayViewModel[] {
    const selected = new Set(nonWorkingWeekdays);

    return Object.values(DayOfWeek).map((value) => ({
      value,
      label: this.i18n.messages.days[value],
      selected: selected.has(value),
    }));
  }

  private presentPublicHolidays(
    publicHolidays: CompanySettingsSnapshot['publicHolidays'],
  ): PublicHolidayViewModel[] {
    return publicHolidays.map((holiday) => ({
      id: holiday.id,
      date: this.formatDate(holiday.date),
      label: holiday.label,
    }));
  }

  private formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }
}
