import {
  InMemoryAbsenceFactSource,
  InMemoryEmployeeDirectory,
  InMemoryHoursFactSource,
  InMemoryPresenceRepository,
  InMemorySickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/adapters';
import {
  AbsenceFact,
  ActorContext,
  CalendarDate,
  EmployeeReference,
  ErrorCode,
  HoursFact,
  HoursFactStatus,
  PresenceMonth,
  SickLeaveDocument,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListPresencesUseCase } from './list-presences.use-case';

const employer: ActorContext = {
  userId: 'user-1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const camille: EmployeeReference = {
  id: 'e1',
  companyId: 'c1',
  fullName: 'Camille Martin',
  userId: 'user-camille',
};
const dominique: EmployeeReference = {
  id: 'e2',
  companyId: 'c1',
  fullName: 'Dominique Durand',
  userId: 'user-dominique',
};

const employeeCamille: ActorContext = {
  userId: 'user-camille',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};
const stranger: EmployeeReference = {
  id: 'e9',
  companyId: 'c2',
  fullName: 'Sacha Petit',
};

const october = PresenceMonth.parse('2026-10');

type Facts = {
  absences?: AbsenceFact[];
  sickLeaves?: SickLeaveDocument[];
  hours?: HoursFact[];
};

function useCaseWith(
  presences = new InMemoryPresenceRepository(),
  facts: Facts = {},
) {
  return new ListPresencesUseCase(
    new InMemoryEmployeeDirectory([camille, dominique, stranger]),
    new InMemoryAbsenceFactSource(facts.absences ?? []),
    new InMemorySickLeaveDocumentSource(facts.sickLeaves ?? []),
    new InMemoryHoursFactSource(facts.hours ?? []),
    presences,
  );
}

function leave(employeeId: string): AbsenceFact {
  return {
    id: `a-${employeeId}`,
    companyId: 'c1',
    employeeId,
    start: CalendarDate.parse('2026-10-05'),
    end: CalendarDate.parse('2026-10-07'),
    type: 'Congés payés',
    days: 3,
    sourceRequestId: 'r1',
  };
}

async function octoberOf(employeeId: string) {
  const presences = new InMemoryPresenceRepository();
  await presences.insert({
    companyId: 'c1',
    employeeId,
    month: october,
    workedDays: 22,
  });
  return presences;
}

describe('ListPresencesUseCase', () => {
  it('lists the presences of the company with the employee names', async () => {
    const presences = new InMemoryPresenceRepository();
    await presences.insert({
      companyId: 'c1',
      employeeId: 'e1',
      month: october,
      workedDays: 22,
    });

    const list = await useCaseWith(presences).execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(list.presences).toEqual([
      expect.objectContaining({
        employeeId: 'e1',
        employeeName: 'Camille Martin',
        month: '2026-10',
      }),
    ]);
  });

  it('lists the most recent month first, then the employees by name', async () => {
    const presences = new InMemoryPresenceRepository();
    for (const [employeeId, month] of [
      ['e2', '2026-09'],
      ['e2', '2026-10'],
      ['e1', '2026-09'],
      ['e1', '2026-10'],
    ] as const) {
      await presences.insert({
        companyId: 'c1',
        employeeId,
        month: PresenceMonth.parse(month),
        workedDays: 20,
      });
    }

    const list = await useCaseWith(presences).execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(
      list.presences.map(
        (presence) => `${presence.month} ${presence.employeeName}`,
      ),
    ).toEqual([
      '2026-10 Camille Martin',
      '2026-10 Dominique Durand',
      '2026-09 Camille Martin',
      '2026-09 Dominique Durand',
    ]);
  });

  it('leaves out a presence whose employee the company does not know', async () => {
    const presences = new InMemoryPresenceRepository();
    await presences.insert({
      companyId: 'c1',
      employeeId: 'ghost',
      month: october,
      workedDays: 20,
    });

    const list = await useCaseWith(presences).execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(list.presences).toEqual([]);
  });

  it('shows the leaves, the sick leaves and the overtime published for the month', async () => {
    const [snapshot] = (
      await useCaseWith(await octoberOf('e1'), {
        absences: [leave('e1')],
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
      }).execute({ actor: employer, companyId: 'c1' })
    ).presences;

    expect(snapshot?.leaves.map((entry) => entry.id)).toEqual(['a-e1']);
    expect(snapshot?.sickLeaves.map((entry) => entry.id)).toEqual(['s1']);
    expect(snapshot?.overtime.map((entry) => entry.id)).toEqual(['h1']);
  });

  it('leaves the rubrics empty when nothing was published', async () => {
    const [snapshot] = (
      await useCaseWith(await octoberOf('e1')).execute({
        actor: employer,
        companyId: 'c1',
      })
    ).presences;

    expect([
      snapshot?.leaves,
      snapshot?.absences,
      snapshot?.sickLeaves,
      snapshot?.overtime,
    ]).toEqual([[], [], [], []]);
  });

  it('does not show the facts of another employee', async () => {
    const [snapshot] = (
      await useCaseWith(await octoberOf('e1'), {
        absences: [leave('e2')],
      }).execute({ actor: employer, companyId: 'c1' })
    ).presences;

    expect(snapshot?.leaves).toEqual([]);
  });

  it('drops an absence that was accepted and then cancelled', async () => {
    const published = [leave('e1')];
    const useCase = useCaseWith(await octoberOf('e1'), { absences: published });
    const input = { actor: employer, companyId: 'c1' };
    expect((await useCase.execute(input)).presences[0]?.leaves).toHaveLength(1);

    published.splice(0, published.length);

    expect((await useCase.execute(input)).presences[0]?.leaves).toEqual([]);
  });

  it('lets the employer manage the months it lists', async () => {
    const list = await useCaseWith().execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(list.canManage).toBe(true);
  });

  it('offers the employees of the company only', async () => {
    const list = await useCaseWith().execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(list.employees).toEqual([camille, dominique]);
  });

  it('leaves out the presences of another company', async () => {
    const presences = new InMemoryPresenceRepository();
    await presences.insert({
      companyId: 'c2',
      employeeId: 'e9',
      month: october,
      workedDays: 20,
    });

    const list = await useCaseWith(presences).execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(list.presences).toEqual([]);
  });

  it('lists nothing when no month has been opened', async () => {
    const list = await useCaseWith().execute({
      actor: employer,
      companyId: 'c1',
    });

    expect(list.presences).toEqual([]);
  });

  describe('filtered by the employer', () => {
    async function schedule() {
      const presences = new InMemoryPresenceRepository();
      for (const [employeeId, month] of [
        ['e1', '2026-08'],
        ['e1', '2026-09'],
        ['e1', '2026-10'],
        ['e2', '2026-09'],
        ['e9', '2026-09'],
      ] as const) {
        await presences.insert({
          companyId: employeeId === 'e9' ? 'c2' : 'c1',
          employeeId,
          month: PresenceMonth.parse(month),
          workedDays: 20,
        });
      }
      return useCaseWith(presences);
    }

    const labels = (list: { presences: readonly { month: string; employeeId: string }[] }) =>
      list.presences.map((presence) => `${presence.employeeId} ${presence.month}`);

    it('shows the months of the chosen employee only', async () => {
      const list = await (
        await schedule()
      ).execute({ actor: employer, companyId: 'c1', employeeId: 'e2' });

      expect(labels(list)).toEqual(['e2 2026-09']);
    });

    it('does not show the other months of the filtered period', async () => {
      const list = await (
        await schedule()
      ).execute({
        actor: employer,
        companyId: 'c1',
        employeeId: 'e1',
        from: '2026-09',
        to: '2026-09',
      });

      expect(labels(list)).toEqual(['e1 2026-09']);
    });

    it('keeps the months from the start month on', async () => {
      const list = await (
        await schedule()
      ).execute({
        actor: employer,
        companyId: 'c1',
        employeeId: 'e1',
        from: '2026-09',
      });

      expect(labels(list)).toEqual(['e1 2026-10', 'e1 2026-09']);
    });

    it('keeps the months up to the end month', async () => {
      const list = await (
        await schedule()
      ).execute({
        actor: employer,
        companyId: 'c1',
        employeeId: 'e1',
        to: '2026-09',
      });

      expect(labels(list)).toEqual(['e1 2026-09', 'e1 2026-08']);
    });

    it('shows nothing for an employee of another company', async () => {
      const list = await (
        await schedule()
      ).execute({ actor: employer, companyId: 'c1', employeeId: 'e9' });

      expect(list.presences).toEqual([]);
    });

    it('shows nothing when no month falls in the period', async () => {
      const list = await (
        await schedule()
      ).execute({
        actor: employer,
        companyId: 'c1',
        from: '2027-01',
        to: '2027-03',
      });

      expect(list.presences).toEqual([]);
    });

    it('refuses a period whose end precedes its start', async () => {
      await expect(
        (
          await schedule()
        ).execute({
          actor: employer,
          companyId: 'c1',
          from: '2026-10',
          to: '2026-09',
        }),
      ).rejects.toThrow(ErrorCode.INVALID_PERIOD);
    });

    it('accepts a period that starts and ends the same month', async () => {
      const list = await (
        await schedule()
      ).execute({
        actor: employer,
        companyId: 'c1',
        from: '2026-09',
        to: '2026-09',
      });

      expect(labels(list)).toEqual(['e1 2026-09', 'e2 2026-09']);
    });

    it('refuses a bound that is not a calendar month', async () => {
      await expect(
        (
          await schedule()
        ).execute({ actor: employer, companyId: 'c1', from: '2026-13' }),
      ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    });

    it('still offers every employee of the company to filter on', async () => {
      const list = await (
        await schedule()
      ).execute({ actor: employer, companyId: 'c1', employeeId: 'e2' });

      expect(list.employees.map((employee) => employee.id)).toEqual(['e1', 'e2']);
    });
  });

  it('applies the period to the months of an employee and ignores another employee', async () => {
    const presences = new InMemoryPresenceRepository();
    for (const [employeeId, month] of [
      ['e1', '2026-08'],
      ['e1', '2026-09'],
      ['e2', '2026-09'],
    ] as const) {
      await presences.insert({
        companyId: 'c1',
        employeeId,
        month: PresenceMonth.parse(month),
        workedDays: 20,
      });
    }

    const list = await useCaseWith(presences).execute({
      actor: employeeCamille,
      companyId: 'c1',
      employeeId: 'e2',
      from: '2026-09',
    });

    expect(
      list.presences.map((presence) => `${presence.employeeId} ${presence.month}`),
    ).toEqual(['e1 2026-09']);
  });

  it('refuses an accountant', async () => {
    await expect(
      useCaseWith().execute({
        actor: { ...employer, role: UserRole.ACCOUNTANT },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor without role', async () => {
    await expect(
      useCaseWith().execute({
        actor: { ...employer, role: null },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor bound to another company, whatever the role', async () => {
    const useCase = useCaseWith();

    await expect(
      useCase.execute({
        actor: { ...employer, companyId: 'c2' },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(
      useCase.execute({
        actor: { ...employeeCamille, companyId: 'c2' },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  describe('for an employee', () => {
    async function everyoneOfOctober() {
      const presences = new InMemoryPresenceRepository();
      for (const employeeId of ['e1', 'e2']) {
        await presences.insert({
          companyId: 'c1',
          employeeId,
          month: october,
          workedDays: 22,
        });
      }
      await presences.insert({
        companyId: 'c1',
        employeeId: 'e1',
        month: PresenceMonth.parse('2026-09'),
        workedDays: 21,
      });
      return presences;
    }

    it('lists only the months of the employee', async () => {
      const list = await useCaseWith(await everyoneOfOctober()).execute({
        actor: employeeCamille,
        companyId: 'c1',
      });

      expect(
        list.presences.map((presence) => [presence.employeeId, presence.month]),
      ).toEqual([
        ['e1', '2026-10'],
        ['e1', '2026-09'],
      ]);
    });

    it('does not let the employee manage the months', async () => {
      const list = await useCaseWith(await everyoneOfOctober()).execute({
        actor: employeeCamille,
        companyId: 'c1',
      });

      expect(list.canManage).toBe(false);
    });

    it('does not reveal the colleagues', async () => {
      const list = await useCaseWith(await everyoneOfOctober()).execute({
        actor: employeeCamille,
        companyId: 'c1',
      });

      expect(list.employees).toEqual([]);
    });

    it('lists nothing when no month of the employee was opened', async () => {
      const list = await useCaseWith(await octoberOf('e2')).execute({
        actor: employeeCamille,
        companyId: 'c1',
      });

      expect(list.presences).toEqual([]);
    });

    it('refuses an employee whose account matches no employee file', async () => {
      await expect(
        useCaseWith().execute({
          actor: { ...employeeCamille, userId: 'user-ghost' },
          companyId: 'c1',
        }),
      ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    });
  });
});
