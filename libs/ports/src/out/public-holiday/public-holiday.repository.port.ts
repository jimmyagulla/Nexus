import {
  CalendarDate,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';

export interface IPublicHolidayRepository {
  insert(date: CalendarDate, label: string): Promise<PublicHoliday>;
  save(holiday: PublicHoliday): Promise<void>;
  findById(id: string): Promise<PublicHoliday | null>;
  findByDateAndLabel(
    date: CalendarDate,
    label: string,
  ): Promise<PublicHoliday | null>;
}

export const IPublicHolidayRepository = Symbol('IPublicHolidayRepository');
