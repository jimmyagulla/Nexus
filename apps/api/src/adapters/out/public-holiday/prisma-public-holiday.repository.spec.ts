import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaPublicHolidayRepository } from './prisma-public-holiday.repository';

type PublicHolidayRow = { id: string; date: string; label: string };

type UpsertArgs = {
  where: { id: string };
  create: PublicHolidayRow;
  update: { date: string; label: string };
};

type FindArgs = {
  where: { id?: string; date_label?: { date: string; label: string } };
};

type HolidayCreateData = { id?: string; date: string; label: string };

type FakePrisma = {
  client: PrismaDb;
  rows: PublicHolidayRow[];
  creates: HolidayCreateData[];
};

function createFakePrisma(seed: PublicHolidayRow[] = []): FakePrisma {
  const rows = [...seed];
  const creates: HolidayCreateData[] = [];

  const client = {
    publicHoliday: {
      create: async (args: { data: HolidayCreateData }) => {
        creates.push(args.data);
        const row = {
          id: args.data.id ?? 'generated-holiday-id',
          date: args.data.date,
          label: args.data.label,
        };
        rows.push(row);
        return row;
      },
      upsert: async (args: UpsertArgs): Promise<void> => {
        const stored = rows.find((row) => row.id === args.where.id);
        if (stored === undefined) {
          rows.push({ ...args.create });
          return;
        }
        stored.date = args.update.date;
        stored.label = args.update.label;
      },
      findUnique: async (args: FindArgs): Promise<PublicHolidayRow | null> => {
        const { id, date_label: dateLabel } = args.where;
        const found = rows.find((row) =>
          id === undefined
            ? row.date === dateLabel?.date && row.label === dateLabel?.label
            : row.id === id,
        );
        return found ?? null;
      },
    },
  };

  return { client: client as unknown as PrismaDb, rows, creates };
}

function holidayOf(id: string, date: string, label: string): PublicHoliday {
  return new PublicHoliday(id, CalendarDate.parse(date), label);
}

describe('PrismaPublicHolidayRepository', () => {
  it('lets the database assign the id of a new public holiday', async () => {
    const { client, rows, creates } = createFakePrisma();
    const repository = new PrismaPublicHolidayRepository(client);

    const holiday = await repository.insert(
      CalendarDate.parse('2026-07-14'),
      'Fête',
    );

    expect(creates).toEqual([{ date: '2026-07-14', label: 'Fête' }]);
    expect(holiday.id).toBe('generated-holiday-id');
    expect(rows).toEqual([
      { id: 'generated-holiday-id', date: '2026-07-14', label: 'Fête' },
    ]);
    expect(await repository.findById(holiday.id)).toEqual(holiday);
  });

  it('reads back the public holiday it has just written', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaPublicHolidayRepository(client);

    await repository.save(holidayOf('holiday-1', '2026-07-14', 'Fête'));
    const reloaded = await repository.findById('holiday-1');

    expect(reloaded?.id).toBe('holiday-1');
    expect(reloaded?.date.value).toBe('2026-07-14');
    expect(reloaded?.label).toBe('Fête');
  });

  it('turns the domain holiday into a flat record', async () => {
    const { client, rows } = createFakePrisma();

    await new PrismaPublicHolidayRepository(client).save(
      holidayOf('holiday-1', '2026-07-14', 'Fête'),
    );

    expect(rows).toEqual([
      { id: 'holiday-1', date: '2026-07-14', label: 'Fête' },
    ]);
  });

  it('returns null when no holiday carries the id', async () => {
    const { client } = createFakePrisma();

    await expect(
      new PrismaPublicHolidayRepository(client).findById('unknown'),
    ).resolves.toBeNull();
  });

  it('replaces the date and the label of an already stored holiday', async () => {
    const { client, rows } = createFakePrisma();
    const repository = new PrismaPublicHolidayRepository(client);

    await repository.save(holidayOf('holiday-1', '2026-07-14', 'Fête'));
    await repository.save(holidayOf('holiday-1', '2026-12-25', 'Noël'));
    const reloaded = await repository.findById('holiday-1');

    expect(rows).toHaveLength(1);
    expect(reloaded?.date.value).toBe('2026-12-25');
    expect(reloaded?.label).toBe('Noël');
  });

  it('finds a holiday by its date and label pair', async () => {
    const { client } = createFakePrisma([
      { id: 'holiday-1', date: '2026-07-14', label: 'Fête' },
      { id: 'holiday-2', date: '2026-12-25', label: 'Noël' },
    ]);

    const found = await new PrismaPublicHolidayRepository(
      client,
    ).findByDateAndLabel(CalendarDate.parse('2026-12-25'), 'Noël');

    expect(found?.id).toBe('holiday-2');
    expect(found?.date.value).toBe('2026-12-25');
  });

  it('returns null when the date matches but the label does not', async () => {
    const { client } = createFakePrisma([
      { id: 'holiday-1', date: '2026-07-14', label: 'Fête' },
    ]);

    await expect(
      new PrismaPublicHolidayRepository(client).findByDateAndLabel(
        CalendarDate.parse('2026-07-14'),
        'Bastille Day',
      ),
    ).resolves.toBeNull();
  });
});
