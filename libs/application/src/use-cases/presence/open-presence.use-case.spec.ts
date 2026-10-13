import {
  InMemoryAbsenceFactSource,
  InMemoryCompanyRepository,
  InMemoryEmployeeDirectory,
  InMemoryHoursFactSource,
  InMemoryPresenceRepository,
  InMemorySickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/adapters';
import {
  AbsenceFact,
  ActorContext,
  CalendarDate,
  Company,
  CompanyName,
  CompanyPublicHoliday,
  DayOfWeek,
  EmployeeReference,
  ErrorCode,
  HoursFact,
  HoursFactStatus,
  PresenceMonth,
  PublicHoliday,
  SickLeaveDocument,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { OpenPresenceUseCase } from './open-presence.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const camille: EmployeeReference = {
  id: 'e1',
  companyId: 'c1',
  fullName: 'Camille Martin',
};

function absence(
  start: string,
  end: string,
  employeeId = 'e1',
): AbsenceFact {
  return {
    id: `a-${employeeId}-${start}`,
    companyId: 'c1',
    employeeId,
    start: CalendarDate.parse(start),
    end: CalendarDate.parse(end),
    type: 'Congés payés',
    days: 3,
    sourceRequestId: 'r1',
  };
}

function acme(): Company {
  return Company.create('c1', CompanyName.parse('Acme'));
}

function useCaseWith(
  employees: readonly EmployeeReference[] = [camille],
  options: {
    company?: Company;
    absences?: readonly AbsenceFact[];
    sickLeaves?: readonly SickLeaveDocument[];
    hours?: readonly HoursFact[];
  } = {},
) {
  const presences = new InMemoryPresenceRepository();
  const hours = new InMemoryHoursFactSource(options.hours ?? []);
  const company = options.company ?? acme();
  const useCase = new OpenPresenceUseCase(
    new InMemoryCompanyRepository(new Map([[company.id, company]])),
    new InMemoryEmployeeDirectory(employees),
    new InMemoryAbsenceFactSource(options.absences ?? []),
    new InMemorySickLeaveDocumentSource(options.sickLeaves ?? []),
    hours,
    presences,
  );

  return { useCase, presences, hours };
}

function hoursFact(
  id: string,
  date: string,
  status: HoursFactStatus,
  employeeId = 'e1',
): HoursFact {
  return {
    id,
    companyId: 'c1',
    employeeId,
    date: CalendarDate.parse(date),
    hours: 2,
    sourceDeclarationId: `d-${id}`,
    status,
  };
}

const statuses = async (
  hours: InMemoryHoursFactSource,
  employeeId = 'e1',
): Promise<Record<string, HoursFactStatus>> =>
  Object.fromEntries(
    (await hours.listForEmployee('c1', employeeId)).map((fact) => [
      fact.id,
      fact.status,
    ]),
  );

const openOctober = {
  actor: employer,
  companyId: 'c1',
  employeeId: 'e1',
  month: '2026-10',
};

describe('OpenPresenceUseCase', () => {
  describe('the hours of the month', () => {
    it('turns the validated hours of the month into processed hours', async () => {
      const { useCase, hours } = useCaseWith([camille], {
        hours: [hoursFact('h1', '2026-10-12', HoursFactStatus.VALIDATED)],
      });

      await useCase.execute(openOctober);

      expect(await statuses(hours)).toEqual({ h1: HoursFactStatus.PROCESSED });
    });

    it('shows the hours it has just processed in the opened month', async () => {
      const { useCase } = useCaseWith([camille], {
        hours: [hoursFact('h1', '2026-10-12', HoursFactStatus.VALIDATED)],
      });

      const presence = await useCase.execute(openOctober);

      expect(presence.overtime).toEqual([
        { id: 'h1', date: '2026-10-12', hours: 2 },
      ]);
    });

    it('leaves the hours that are already processed as they are', async () => {
      const { useCase, hours } = useCaseWith([camille], {
        hours: [hoursFact('h1', '2026-10-12', HoursFactStatus.PROCESSED)],
      });

      await useCase.execute(openOctober);

      expect(await statuses(hours)).toEqual({ h1: HoursFactStatus.PROCESSED });
    });

    it('leaves the validated hours of another month waiting', async () => {
      const { useCase, hours } = useCaseWith([camille], {
        hours: [
          hoursFact('h1', '2026-09-30', HoursFactStatus.VALIDATED),
          hoursFact('h2', '2026-11-02', HoursFactStatus.VALIDATED),
        ],
      });

      await useCase.execute(openOctober);

      expect(await statuses(hours)).toEqual({
        h1: HoursFactStatus.VALIDATED,
        h2: HoursFactStatus.VALIDATED,
      });
    });

    it('leaves the validated hours of another employee waiting', async () => {
      const { useCase, hours } = useCaseWith([camille], {
        hours: [hoursFact('h1', '2026-10-12', HoursFactStatus.VALIDATED, 'e2')],
      });

      await useCase.execute(openOctober);

      expect(await statuses(hours, 'e2')).toEqual({
        h1: HoursFactStatus.VALIDATED,
      });
    });

    it('opens a month without any hours', async () => {
      const { useCase } = useCaseWith();

      await expect(useCase.execute(openOctober)).resolves.toMatchObject({
        overtime: [],
      });
    });

    it('does not process the hours when the month is already open', async () => {
      const { useCase, presences, hours } = useCaseWith([camille], {
        hours: [hoursFact('h1', '2026-10-12', HoursFactStatus.VALIDATED)],
      });
      await presences.insert({
        companyId: 'c1',
        employeeId: 'e1',
        month: PresenceMonth.parse('2026-10'),
        workedDays: 22,
      });

      await expect(useCase.execute(openOctober)).rejects.toThrow(
        ErrorCode.POTENTIAL_DUPLICATE,
      );
      expect(await statuses(hours)).toEqual({ h1: HoursFactStatus.VALIDATED });
    });

    it('does not process the hours of a refused opening', async () => {
      const { useCase, hours } = useCaseWith([camille], {
        hours: [hoursFact('h1', '2026-10-12', HoursFactStatus.VALIDATED)],
      });

      await expect(
        useCase.execute({
          ...openOctober,
          actor: { ...employer, role: UserRole.EMPLOYEE },
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
      expect(await statuses(hours)).toEqual({ h1: HoursFactStatus.VALIDATED });
    });
  });

  it('opens the month of an employee', async () => {
    const { useCase } = useCaseWith();

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect(presence).toMatchObject({
      employeeId: 'e1',
      employeeName: 'Camille Martin',
      month: '2026-10',
    });
  });

  it('refuses a month that is not a calendar month', async () => {
    const { useCase, presences } = useCaseWith();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-13',
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(await presences.list({ companyId: 'c1' })).toEqual([]);
  });

  it('refuses to open a month for an employee who is not the employer', async () => {
    const { useCase, presences } = useCaseWith();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-10',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(await presences.list({ companyId: 'c1' })).toEqual([]);
  });

  it('refuses the employer of another company', async () => {
    const { useCase, presences } = useCaseWith();

    await expect(
      useCase.execute({
        actor: { ...employer, companyId: 'c2' },
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-10',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(await presences.list({ companyId: 'c1' })).toEqual([]);
  });

  it('refuses an employee of another company without opening anything', async () => {
    const stranger: EmployeeReference = {
      id: 'e2',
      companyId: 'c2',
      fullName: 'Dominique Durand',
    };
    const { useCase, presences } = useCaseWith([camille, stranger]);

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        employeeId: 'e2',
        month: '2026-10',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(await presences.list({ companyId: 'c1' })).toEqual([]);
    expect(await presences.list({ companyId: 'c2' })).toEqual([]);
  });

  it('refuses an employee nobody knows', async () => {
    const { useCase, presences } = useCaseWith();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        employeeId: 'ghost',
        month: '2026-10',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(await presences.list({ companyId: 'c1' })).toEqual([]);
  });

  it('proposes the days the company calendar leaves working', async () => {
    const { useCase } = useCaseWith();

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect(presence.workedDays).toBe(22);
  });

  it('does not count a Sunday of the default calendar as worked', async () => {
    const { useCase } = useCaseWith();

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-02',
    });

    expect(presence.workedDays).toBe(20);
  });

  it('follows the calendar of the company', async () => {
    const company = acme();
    const calendar = company.calendar
      .withNonWorkingWeekdays([DayOfWeek.SUNDAY])
      .addPublicHoliday(
        new CompanyPublicHoliday(
          'c1',
          new PublicHoliday('ph-1', CalendarDate.parse('2026-10-12'), 'Férié'),
        ),
      );
    const { useCase } = useCaseWith([camille], {
      company: company.withCalendar(calendar),
    });

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect(presence.workedDays).toBe(26);
  });

  it('leaves out the days covered by the absences already published', async () => {
    const { useCase } = useCaseWith([camille], {
      absences: [absence('2026-10-05', '2026-10-07')],
    });

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect(presence.workedDays).toBe(19);
  });

  it('shows in the opened month the leaves, the sick leaves and the overtime', async () => {
    const { useCase } = useCaseWith([camille], {
      absences: [absence('2026-10-05', '2026-10-07')],
      sickLeaves: [
        {
          id: 's1',
          companyId: 'c1',
          employeeId: 'e1',
          date: CalendarDate.parse('2026-10-14'),
        },
      ],
      hours: [
        {
          id: 'h1',
          companyId: 'c1',
          employeeId: 'e1',
          date: CalendarDate.parse('2026-10-12'),
          hours: 2,
          sourceDeclarationId: 'd1',
          status: HoursFactStatus.PROCESSED,
        },
      ],
    });

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect(presence.leaves.map((entry) => entry.type)).toEqual(['Congés payés']);
    expect(presence.sickLeaves).toEqual([{ id: 's1', date: '2026-10-14' }]);
    expect(presence.overtime).toEqual([
      { id: 'h1', date: '2026-10-12', hours: 2 },
    ]);
  });

  it('leaves the rubrics of an opened month empty when nothing was published', async () => {
    const { useCase } = useCaseWith();

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect([
      presence.leaves,
      presence.absences,
      presence.sickLeaves,
      presence.overtime,
    ]).toEqual([[], [], [], []]);
  });

  it('leaves out the absences of another employee', async () => {
    const { useCase } = useCaseWith([camille], {
      absences: [absence('2026-10-05', '2026-10-07', 'e2')],
    });

    const presence = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect(presence.workedDays).toBe(22);
  });

  it('keeps the proposed days in the stored presence', async () => {
    const { useCase, presences } = useCaseWith();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    });

    expect(
      (await presences.list({ companyId: 'c1' })).map(
        (presence) => presence.workedDays,
      ),
    ).toEqual([22]);
  });

  it('refuses a company nobody knows', async () => {
    const presences = new InMemoryPresenceRepository();
    const useCase = new OpenPresenceUseCase(
      new InMemoryCompanyRepository(),
      new InMemoryEmployeeDirectory([camille]),
      new InMemoryAbsenceFactSource(),
      new InMemorySickLeaveDocumentSource(),
      new InMemoryHoursFactSource(),
      presences,
    );

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        employeeId: 'e1',
        month: '2026-10',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(await presences.list({ companyId: 'c1' })).toEqual([]);
  });

  it('keeps a single presence for an employee and a month', async () => {
    const { useCase, presences } = useCaseWith();
    const input = {
      actor: employer,
      companyId: 'c1',
      employeeId: 'e1',
      month: '2026-10',
    };
    await useCase.execute(input);

    await expect(useCase.execute(input)).rejects.toThrow(
      ErrorCode.POTENTIAL_DUPLICATE,
    );
    expect(await presences.list({ companyId: 'c1' })).toHaveLength(1);
  });
});
