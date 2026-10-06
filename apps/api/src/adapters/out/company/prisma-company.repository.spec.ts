import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  Company,
  CompanyCalendar,
  CompanyName,
  CompanyPublicHoliday,
  DayOfWeek,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaCompanyRepository } from './prisma-company.repository';

type CompanyRow = { id: string; name: string };
type WeekdayRow = { companyId: string; dayOfWeek: DayOfWeek };
type CompanyHolidayRow = { companyId: string; publicHolidayId: string };
type PublicHolidayRow = { id: string; date: string; label: string };

type Store = {
  companies: CompanyRow[];
  weekdays: WeekdayRow[];
  companyHolidays: CompanyHolidayRow[];
  publicHolidays: PublicHolidayRow[];
};

type FakePrisma = { client: PrismaDb; store: Store };

const COMPANY_ID = 'company-1';

const bastilleDay: PublicHolidayRow = {
  id: 'holiday-1',
  date: '2026-07-14',
  label: 'Fête nationale',
};

const christmas: PublicHolidayRow = {
  id: 'holiday-2',
  date: '2026-12-25',
  label: 'Noël',
};

function writersOn(target: Store, rejectHolidayLinks: boolean) {
  return {
    company: {
      upsert: async (args: {
        where: { id: string };
        create: CompanyRow;
        update: { name: string };
      }): Promise<void> => {
        const stored = target.companies.find((row) => row.id === args.where.id);
        if (stored === undefined) {
          target.companies.push({ ...args.create });
          return;
        }
        stored.name = args.update.name;
      },
    },
    companyNonWorkingWeekday: {
      deleteMany: async (args: {
        where: { companyId: string };
      }): Promise<void> => {
        target.weekdays = target.weekdays.filter(
          (row) => row.companyId !== args.where.companyId,
        );
      },
      createMany: async (args: { data: WeekdayRow[] }): Promise<void> => {
        target.weekdays.push(...args.data);
      },
    },
    companyPublicHoliday: {
      deleteMany: async (args: {
        where: { companyId: string };
      }): Promise<void> => {
        target.companyHolidays = target.companyHolidays.filter(
          (row) => row.companyId !== args.where.companyId,
        );
      },
      createMany: async (args: { data: CompanyHolidayRow[] }): Promise<void> => {
        if (rejectHolidayLinks) {
          throw new Error('public holiday link write rejected');
        }
        target.companyHolidays.push(...args.data);
      },
    },
  };
}

type TransactionClient = ReturnType<typeof writersOn>;

function readCompany(store: Store, id: string) {
  const row = store.companies.find((company) => company.id === id);
  if (row === undefined) {
    return null;
  }

  return {
    ...row,
    nonWorkingWeekdays: store.weekdays
      .filter((weekday) => weekday.companyId === id)
      .map((weekday) => ({ dayOfWeek: weekday.dayOfWeek })),
    publicHolidays: store.companyHolidays
      .filter((link) => link.companyId === id)
      .map((link) => {
        const holiday = store.publicHolidays.find(
          (candidate) => candidate.id === link.publicHolidayId,
        );
        if (holiday === undefined) {
          throw new Error(
            `dangling public holiday link ${link.publicHolidayId}`,
          );
        }
        return { publicHoliday: holiday };
      }),
  };
}

function createFakePrisma(
  seed: Partial<Store> = {},
  options: { rejectHolidayLinks?: boolean } = {},
): FakePrisma {
  const store: Store = {
    companies: [],
    weekdays: [],
    companyHolidays: [],
    publicHolidays: [],
    ...seed,
  };
  const rejectHolidayLinks = options.rejectHolidayLinks === true;

  const client = {
    company: {
      findUnique: async (args: { where: { id: string } }) =>
        readCompany(store, args.where.id),
    },
    $transaction: async <T>(
      run: (tx: TransactionClient) => Promise<T>,
    ): Promise<T> => {
      const draft = structuredClone(store);
      const result = await run(writersOn(draft, rejectHolidayLinks));
      Object.assign(store, draft);
      return result;
    },
  };

  return { client: client as unknown as PrismaDb, store };
}

function companyOf(
  name: string,
  weekdays: readonly DayOfWeek[],
  holidays: readonly PublicHolidayRow[],
): Company {
  return new Company(
    COMPANY_ID,
    CompanyName.parse(name),
    new CompanyCalendar(
      weekdays,
      holidays.map(
        (holiday) =>
          new CompanyPublicHoliday(
            COMPANY_ID,
            new PublicHoliday(
              holiday.id,
              CalendarDate.parse(holiday.date),
              holiday.label,
            ),
          ),
      ),
    ),
  );
}

describe('PrismaCompanyRepository', () => {
  it('reads back the company it has just written', async () => {
    const { client } = createFakePrisma({ publicHolidays: [christmas] });
    const repository = new PrismaCompanyRepository(client);

    await repository.save(
      companyOf('Acme', [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY], [christmas]),
    );
    const reloaded = await repository.findById(COMPANY_ID);

    expect(reloaded?.name.value).toBe('Acme');
    expect(reloaded?.calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
    expect(
      reloaded?.calendar.publicHolidays.map((holiday) => ({
        companyId: holiday.companyId,
        id: holiday.publicHoliday.id,
        date: holiday.publicHoliday.date.value,
        label: holiday.publicHoliday.label,
      })),
    ).toEqual([
      {
        companyId: COMPANY_ID,
        id: christmas.id,
        date: christmas.date,
        label: christmas.label,
      },
    ]);
  });

  it('turns the domain company into identity, weekday and holiday link records', async () => {
    const { client, store } = createFakePrisma({
      publicHolidays: [bastilleDay],
    });

    await new PrismaCompanyRepository(client).save(
      companyOf('Acme', [DayOfWeek.MONDAY], [bastilleDay]),
    );

    expect(store.companies).toEqual([{ id: COMPANY_ID, name: 'Acme' }]);
    expect(store.weekdays).toEqual([
      { companyId: COMPANY_ID, dayOfWeek: DayOfWeek.MONDAY },
    ]);
    expect(store.companyHolidays).toEqual([
      { companyId: COMPANY_ID, publicHolidayId: bastilleDay.id },
    ]);
  });

  it('returns null when the company is absent', async () => {
    const { client } = createFakePrisma();

    await expect(
      new PrismaCompanyRepository(client).findById('unknown'),
    ).resolves.toBeNull();
  });

  it('renames an already stored company without duplicating its record', async () => {
    const { client, store } = createFakePrisma();
    const repository = new PrismaCompanyRepository(client);

    await repository.save(companyOf('Acme', [], []));
    await repository.save(companyOf('Acme Europe', [], []));
    const reloaded = await repository.findById(COMPANY_ID);

    expect(store.companies).toEqual([{ id: COMPANY_ID, name: 'Acme Europe' }]);
    expect(reloaded?.name.value).toBe('Acme Europe');
  });

  it('replaces the stored non-working weekdays', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaCompanyRepository(client);

    await repository.save(
      companyOf('Acme', [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY], []),
    );
    await repository.save(companyOf('Acme', [DayOfWeek.WEDNESDAY], []));
    const reloaded = await repository.findById(COMPANY_ID);

    expect(reloaded?.calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.WEDNESDAY,
    ]);
  });

  it('clears the stored non-working weekdays when the calendar has none', async () => {
    const { client, store } = createFakePrisma();
    const repository = new PrismaCompanyRepository(client);

    await repository.save(companyOf('Acme', [DayOfWeek.SUNDAY], []));
    await repository.save(companyOf('Acme', [], []));

    expect(store.weekdays).toEqual([]);
  });

  it('replaces the retained public holiday links', async () => {
    const { client } = createFakePrisma({
      publicHolidays: [bastilleDay, christmas],
    });
    const repository = new PrismaCompanyRepository(client);

    await repository.save(companyOf('Acme', [], [bastilleDay]));
    await repository.save(companyOf('Acme', [], [christmas]));
    const reloaded = await repository.findById(COMPANY_ID);

    expect(
      reloaded?.calendar.publicHolidays.map(
        (holiday) => holiday.publicHoliday.id,
      ),
    ).toEqual([christmas.id]);
  });

  it('clears the retained public holiday links when the calendar has none', async () => {
    const { client, store } = createFakePrisma({
      publicHolidays: [bastilleDay],
    });
    const repository = new PrismaCompanyRepository(client);

    await repository.save(companyOf('Acme', [], [bastilleDay]));
    await repository.save(companyOf('Acme', [], []));

    expect(store.companyHolidays).toEqual([]);
  });

  it('maps a company stored without weekday nor holiday to empty collections', async () => {
    const { client } = createFakePrisma({
      companies: [{ id: COMPANY_ID, name: 'Acme' }],
    });

    const reloaded = await new PrismaCompanyRepository(client).findById(
      COMPANY_ID,
    );

    expect(reloaded?.calendar.nonWorkingWeekdays).toEqual([]);
    expect(reloaded?.calendar.publicHolidays).toEqual([]);
  });

  it('persists nothing when one write of the save fails', async () => {
    const { client, store } = createFakePrisma(
      {
        companies: [{ id: COMPANY_ID, name: 'Acme' }],
        weekdays: [{ companyId: COMPANY_ID, dayOfWeek: DayOfWeek.SUNDAY }],
        publicHolidays: [bastilleDay],
      },
      { rejectHolidayLinks: true },
    );
    const repository = new PrismaCompanyRepository(client);

    await expect(
      repository.save(
        companyOf('Acme Europe', [DayOfWeek.MONDAY], [bastilleDay]),
      ),
    ).rejects.toThrow('public holiday link write rejected');

    expect(store.companies).toEqual([{ id: COMPANY_ID, name: 'Acme' }]);
    expect(store.weekdays).toEqual([
      { companyId: COMPANY_ID, dayOfWeek: DayOfWeek.SUNDAY },
    ]);
  });
});
