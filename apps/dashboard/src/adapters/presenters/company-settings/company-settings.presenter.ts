import { Weekday } from '@hexagonal-monorepo-template/domain';
import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/ports';

const WEEKDAY_ORDER: { value: Weekday; label: string }[] = [
  { value: Weekday.MONDAY, label: 'Lundi' },
  { value: Weekday.TUESDAY, label: 'Mardi' },
  { value: Weekday.WEDNESDAY, label: 'Mercredi' },
  { value: Weekday.THURSDAY, label: 'Jeudi' },
  { value: Weekday.FRIDAY, label: 'Vendredi' },
  { value: Weekday.SATURDAY, label: 'Samedi' },
  { value: Weekday.SUNDAY, label: 'Dimanche' },
];

export type WeekdayView = {
  value: number;
  label: string;
  selected: boolean;
};

export type HolidayView = {
  id: string;
  caption: string;
};

export type CompanySettingsViewModel = {
  id: string;
  name: string;
  weekdays: WeekdayView[];
  holidays: HolidayView[];
};

export class CompanySettingsPresenter {
  present(settings: CompanySettingsSnapshot): CompanySettingsViewModel {
    return {
      id: settings.id,
      name: settings.name,
      weekdays: this.weekdaysOf(settings.nonWorkingWeekdays),
      holidays: settings.holidays.map((holiday) => this.holidayOf(holiday)),
    };
  }

  private weekdaysOf(selected: readonly number[]): WeekdayView[] {
    return WEEKDAY_ORDER.map((day) => ({
      value: day.value,
      label: day.label,
      selected: selected.includes(day.value),
    }));
  }

  private holidayOf(holiday: {
    id: string;
    date: string;
    label: string;
  }): HolidayView {
    return {
      id: holiday.id,
      caption: `${holiday.date} — ${holiday.label}`,
    };
  }
}
