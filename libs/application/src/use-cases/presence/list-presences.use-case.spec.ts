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
};
const dominique: EmployeeReference = {
  id: 'e2',
  companyId: 'c1',
  fullName: 'Dominique Durand',
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

  it('refuses an actor who is not the employer of the company', async () => {
    const useCase = useCaseWith();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    await expect(
      useCase.execute({
        actor: { ...employer, companyId: 'c2' },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
