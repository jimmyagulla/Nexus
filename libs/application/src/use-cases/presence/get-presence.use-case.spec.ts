import {
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
import { GetPresenceUseCase } from './get-presence.use-case';

const employer: ActorContext = {
  userId: 'user-employer',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};
const camilleUser: ActorContext = {
  userId: 'user-camille',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
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

async function setup() {
  const presences = new InMemoryPresenceRepository();
  const camilleOctober = await presences.insert({
    companyId: 'c1',
    employeeId: 'e1',
    month: PresenceMonth.parse('2026-10'),
    workedDays: 22,
  });
  const dominiqueOctober = await presences.insert({
    companyId: 'c1',
    employeeId: 'e2',
    month: PresenceMonth.parse('2026-10'),
    workedDays: 20,
  });
  const useCase = new GetPresenceUseCase(
    new InMemoryEmployeeDirectory([camille, dominique]),
    new InMemoryAbsenceFactSource(),
    new InMemorySickLeaveDocumentSource(),
    new InMemoryHoursFactSource(),
    presences,
  );

  return { useCase, camilleOctober, dominiqueOctober };
}

describe('GetPresenceUseCase', () => {
  it('opens a month of the company for the employer', async () => {
    const { useCase, dominiqueOctober } = await setup();

    const snapshot = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      presenceId: dominiqueOctober.id,
    });

    expect(snapshot).toMatchObject({
      id: dominiqueOctober.id,
      employeeName: 'Dominique Durand',
      workedDays: 20,
    });
  });

  it('opens its own month for the employee', async () => {
    const { useCase, camilleOctober } = await setup();

    const snapshot = await useCase.execute({
      actor: camilleUser,
      companyId: 'c1',
      presenceId: camilleOctober.id,
    });

    expect(snapshot.employeeName).toBe('Camille Martin');
  });

  it('answers a direct link to another employee with an access refusal', async () => {
    const { useCase, dominiqueOctober } = await setup();

    await expect(
      useCase.execute({
        actor: camilleUser,
        companyId: 'c1',
        presenceId: dominiqueOctober.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('answers a month nobody opened exactly like a month of someone else', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({
        actor: camilleUser,
        companyId: 'c1',
        presenceId: 'ghost',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses the employer of another company', async () => {
    const { useCase, camilleOctober } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employer, companyId: 'c2' },
        companyId: 'c1',
        presenceId: camilleOctober.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employee bound to another company', async () => {
    const { useCase, camilleOctober } = await setup();

    await expect(
      useCase.execute({
        actor: { ...camilleUser, companyId: 'c2' },
        companyId: 'c1',
        presenceId: camilleOctober.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employee whose account matches no employee file', async () => {
    const { useCase, camilleOctober } = await setup();

    await expect(
      useCase.execute({
        actor: { ...camilleUser, userId: 'user-ghost' },
        companyId: 'c1',
        presenceId: camilleOctober.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an accountant', async () => {
    const { useCase, camilleOctober } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.ACCOUNTANT },
        companyId: 'c1',
        presenceId: camilleOctober.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
