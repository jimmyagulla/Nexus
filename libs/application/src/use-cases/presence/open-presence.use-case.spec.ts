import {
  InMemoryEmployeeDirectory,
  InMemoryPresenceRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  EmployeeReference,
  ErrorCode,
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

function useCaseWith(employees: readonly EmployeeReference[] = [camille]) {
  const presences = new InMemoryPresenceRepository();
  const useCase = new OpenPresenceUseCase(
    new InMemoryEmployeeDirectory(employees),
    presences,
  );

  return { useCase, presences };
}

describe('OpenPresenceUseCase', () => {
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
