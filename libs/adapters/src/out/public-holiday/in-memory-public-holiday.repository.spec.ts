import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryPublicHolidayRepository } from './in-memory-public-holiday.repository';

const bastilleDay = new PublicHoliday(
  'ph-1',
  CalendarDate.parse('2026-07-14'),
  'Bastille Day',
);

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('InMemoryPublicHolidayRepository', () => {
  it('assigns an id when inserting a public holiday', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    const holiday = await publicHolidays.insert(
      CalendarDate.parse('2026-07-14'),
      'Bastille Day',
    );

    expect(holiday.id).toMatch(ASSIGNED_ID);
    expect(holiday.date.value).toBe('2026-07-14');
    expect(holiday.label).toBe('Bastille Day');
    expect(await publicHolidays.findById(holiday.id)).toEqual(holiday);
  });

  it('assigns a different id to each inserted public holiday', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    const first = await publicHolidays.insert(
      CalendarDate.parse('2026-07-14'),
      'Bastille Day',
    );
    const second = await publicHolidays.insert(
      CalendarDate.parse('2026-12-25'),
      'Christmas',
    );

    expect(first.id).not.toBe(second.id);
  });

  it('saves and finds a public holiday by id', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    await publicHolidays.save(bastilleDay);

    expect(await publicHolidays.findById('ph-1')).toEqual(bastilleDay);
  });

  it('finds nothing for an unknown id', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    await publicHolidays.save(bastilleDay);

    expect(await publicHolidays.findById('ph-missing')).toBeNull();
  });

  it('finds nothing by id in an empty collection', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    expect(await publicHolidays.findById('ph-1')).toBeNull();
  });

  it('replaces a public holiday saved again under the same id', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();
    const renamed = new PublicHoliday(
      'ph-1',
      CalendarDate.parse('2026-07-14'),
      'National Day',
    );

    await publicHolidays.save(bastilleDay);
    await publicHolidays.save(renamed);

    expect(await publicHolidays.findById('ph-1')).toEqual(renamed);
  });

  it('finds a public holiday by date and label', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    await publicHolidays.save(bastilleDay);

    expect(
      await publicHolidays.findByDateAndLabel(
        CalendarDate.parse('2026-07-14'),
        'Bastille Day',
      ),
    ).toEqual(bastilleDay);
  });

  it('finds nothing when the label differs from the stored one', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    await publicHolidays.save(bastilleDay);

    expect(
      await publicHolidays.findByDateAndLabel(
        CalendarDate.parse('2026-07-14'),
        'National Day',
      ),
    ).toBeNull();
  });

  it('finds nothing when the date differs from the stored one', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    await publicHolidays.save(bastilleDay);

    expect(
      await publicHolidays.findByDateAndLabel(
        CalendarDate.parse('2026-07-15'),
        'Bastille Day',
      ),
    ).toBeNull();
  });

  it('finds nothing by date and label in an empty collection', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();

    expect(
      await publicHolidays.findByDateAndLabel(
        CalendarDate.parse('2026-07-14'),
        'Bastille Day',
      ),
    ).toBeNull();
  });

  it('singles out the public holiday matching both the date and the label', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository();
    const sameDate = new PublicHoliday(
      'ph-2',
      CalendarDate.parse('2026-07-14'),
      'National Day',
    );
    const sameLabel = new PublicHoliday(
      'ph-3',
      CalendarDate.parse('2027-07-14'),
      'Bastille Day',
    );

    await publicHolidays.save(sameDate);
    await publicHolidays.save(sameLabel);
    await publicHolidays.save(bastilleDay);

    expect(
      await publicHolidays.findByDateAndLabel(
        CalendarDate.parse('2026-07-14'),
        'Bastille Day',
      ),
    ).toEqual(bastilleDay);
  });

  it('reads the public holidays seeded through the injected collection', async () => {
    const publicHolidays = new InMemoryPublicHolidayRepository(
      new Map([['ph-1', bastilleDay]]),
    );

    expect(await publicHolidays.findById('ph-1')).toEqual(bastilleDay);
  });
});
