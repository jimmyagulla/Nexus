import {
  FixedClock,
  InMemoryAbsenceFactSource,
  InMemoryEmployeeDirectory,
  InMemoryHoursFactSource,
  InMemoryPresenceRepository,
  InMemorySickLeaveDocumentSource,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  EmployeeReference,
  ErrorCode,
  PresenceMonth,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AdjustPresenceWorkedDaysUseCase } from './adjust-presence-worked-days.use-case';

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

const now = new Date('2026-10-13T09:00:00.000Z');

async function setup() {
  const presences = new InMemoryPresenceRepository();
  const opened = await presences.insert({
    companyId: 'c1',
    employeeId: 'e1',
    month: PresenceMonth.parse('2026-10'),
    workedDays: 22,
  });
  const useCase = new AdjustPresenceWorkedDaysUseCase(
    new InMemoryEmployeeDirectory([camille]),
    new InMemoryAbsenceFactSource(),
    new InMemorySickLeaveDocumentSource(),
    new InMemoryHoursFactSource(),
    presences,
    new FixedClock(now),
  );

  return { useCase, presences, opened };
}

describe('AdjustPresenceWorkedDaysUseCase', () => {
  it('lets the employer correct the worked days', async () => {
    const { useCase, opened } = await setup();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      presenceId: opened.id,
      workedDays: 20,
    });

    expect(snapshot).toMatchObject({
      id: opened.id,
      employeeName: 'Camille Martin',
      workedDays: 20,
      proposedWorkedDays: 22,
    });
  });

  it('shows the old and the new value in the history', async () => {
    const { useCase, opened } = await setup();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      presenceId: opened.id,
      workedDays: 20,
    });

    expect(snapshot.adjustments).toEqual([
      {
        actorId: 'user-1',
        occurredAt: '2026-10-13T09:00:00.000Z',
        before: 22,
        after: 20,
      },
    ]);
  });

  it('keeps the corrected days for the next reading', async () => {
    const { useCase, presences, opened } = await setup();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      presenceId: opened.id,
      workedDays: 20,
    });

    expect((await presences.findById('c1', opened.id))?.workedDays).toBe(20);
  });

  it('keeps the earlier corrections when it corrects again', async () => {
    const { useCase, opened } = await setup();
    const input = { actor: employer, companyId: 'c1', presenceId: opened.id };
    await useCase.execute({ ...input, workedDays: 20 });

    const snapshot = await useCase.execute({ ...input, workedDays: 21 });

    expect(snapshot.adjustments.map((entry) => [entry.before, entry.after])).toEqual([
      [22, 20],
      [20, 21],
    ]);
    expect(snapshot.proposedWorkedDays).toBe(22);
  });

  it('records nothing when the days stay the same', async () => {
    const { useCase, opened } = await setup();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      presenceId: opened.id,
      workedDays: 22,
    });

    expect(snapshot.adjustments).toEqual([]);
  });

  it('refuses an employee: the employee does not correct', async () => {
    const { useCase, presences, opened } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
        presenceId: opened.id,
        workedDays: 20,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await presences.findById('c1', opened.id))?.workedDays).toBe(22);
  });

  it('refuses the employer of another company', async () => {
    const { useCase, presences, opened } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employer, companyId: 'c2' },
        companyId: 'c1',
        presenceId: opened.id,
        workedDays: 20,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await presences.findById('c1', opened.id))?.workedDays).toBe(22);
  });

  it('refuses a month nobody opened', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        presenceId: 'ghost',
        workedDays: 20,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses more days than the month holds', async () => {
    const { useCase, presences, opened } = await setup();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        presenceId: opened.id,
        workedDays: 32,
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect((await presences.findById('c1', opened.id))?.adjustments).toEqual([]);
  });

  it('refuses a fraction of a day', async () => {
    const { useCase, opened } = await setup();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        presenceId: opened.id,
        workedDays: 20.5,
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses a presence whose employee the company does not know', async () => {
    const presences = new InMemoryPresenceRepository();
    const opened = await presences.insert({
      companyId: 'c1',
      employeeId: 'ghost',
      month: PresenceMonth.parse('2026-10'),
      workedDays: 22,
    });
    const useCase = new AdjustPresenceWorkedDaysUseCase(
      new InMemoryEmployeeDirectory([camille]),
      new InMemoryAbsenceFactSource(),
      new InMemorySickLeaveDocumentSource(),
      new InMemoryHoursFactSource(),
      presences,
      new FixedClock(now),
    );

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        presenceId: opened.id,
        workedDays: 20,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
