import {
  InMemoryEmployeeRepository,
  InMemoryExpenseReportRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Employee,
  EmployeeStatus,
  ErrorCode,
  ExpenseReportStatus,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { CreateExpenseReportUseCase } from './create-expense-report.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function useCaseWith(status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  const reports = new InMemoryExpenseReportRepository();
  const useCase = new CreateExpenseReportUseCase(
    new InMemoryEmployeeRepository([new Employee('e1', 'c1', status)]),
    reports,
  );
  return { reports, useCase };
}

describe('CreateExpenseReportUseCase', () => {
  it('opens a draft report for the active employee', async () => {
    const { useCase } = useCaseWith();

    const report = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      label: 'Déplacement Lyon',
    });

    expect(report).toMatchObject({
      companyId: 'c1',
      employeeId: 'e1',
      label: 'Déplacement Lyon',
      status: ExpenseReportStatus.DRAFT,
      expenses: [],
    });
  });

  it('stores the report so that it can be found again', async () => {
    const { reports, useCase } = useCaseWith();

    const created = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      label: 'Déplacement Lyon',
    });

    expect((await reports.findById('c1', created.id))?.label.value).toBe(
      'Déplacement Lyon',
    );
  });

  it('refuses an inactive employee', async () => {
    const { reports, useCase } = useCaseWith(EmployeeStatus.INACTIVE);

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', label: 'Lyon' }),
    ).rejects.toThrow(ErrorCode.INACTIVE_EMPLOYEE);
    expect(await reports.list('c1', {})).toEqual([]);
  });

  it('refuses a blank label', async () => {
    const { useCase } = useCaseWith();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', label: ' ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses an employer, who creates no report', async () => {
    const { useCase } = useCaseWith();

    await expect(
      useCase.execute({
        actor: { ...employee, role: UserRole.EMPLOYER },
        companyId: 'c1',
        label: 'Lyon',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses another company', async () => {
    const { useCase } = useCaseWith();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c2', label: 'Lyon' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor unknown to the company without saying so', async () => {
    const reports = new InMemoryExpenseReportRepository();
    const useCase = new CreateExpenseReportUseCase(
      new InMemoryEmployeeRepository(),
      reports,
    );

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', label: 'Lyon' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
