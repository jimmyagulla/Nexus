import {
  CalendarDate,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';
import {
  IIdGenerator,
  IPublicHolidayRepository,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryPublicHolidayRepository implements IPublicHolidayRepository {
  constructor(
    private readonly ids: IIdGenerator,
    private readonly holidays = new Map<string, PublicHoliday>(),
  ) {}

  async insert(date: CalendarDate, label: string): Promise<PublicHoliday> {
    const holiday = new PublicHoliday(this.ids.next(), date, label);
    this.holidays.set(holiday.id, holiday);
    return holiday;
  }

  async save(holiday: PublicHoliday): Promise<void> {
    this.holidays.set(holiday.id, holiday);
  }

  async findById(id: string): Promise<PublicHoliday | null> {
    return this.holidays.get(id) ?? null;
  }

  async findByDateAndLabel(
    date: CalendarDate,
    label: string,
  ): Promise<PublicHoliday | null> {
    return (
      [...this.holidays.values()].find(
        (holiday) => holiday.date.equals(date) && holiday.label === label,
      ) ?? null
    );
  }
}
