import {
  InMemoryEmployeeRepository,
  InMemoryExpenseReportRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Employee,
  EmployeeStatus,
  ErrorCode,
  ExpenseReportLabel,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListExpenseReportsUseCase } from './list-expense-reports.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

async function setup(status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  const reports = new InMemoryExpenseReportRepository();
  await reports.insert('c1', 'e1', ExpenseReportLabel.parse('Lyon'));
  await reports.insert('c1', 'e2', ExpenseReportLabel.parse('Paris'));
  await reports.insert('c2', 'e1', ExpenseReportLabel.parse('Nantes'));
  return new ListExpenseReportsUseCase(
    new InMemoryEmployeeRepository([
      new Employee('e1', 'c1', status),
      new Employee('e9', 'c1', EmployeeStatus.ACTIVE),
    ]),
    reports,
  );
}

describe('ListExpenseReportsUseCase', () => {
  it('lists only the reports of the employee', async () => {
    const useCase = await setup();

    const { reports } = await useCase.execute({
      actor: employee,
      companyId: 'c1',
    });

    expect(reports.map((report) => report.label)).toEqual(['Lyon']);
  });

  it('lists nothing for an employee without report', async () => {
    const useCase = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e9' },
        companyId: 'c1',
      }),
    ).resolves.toEqual({ canCreate: true, reports: [] });
  });

  it('lets an active employee create a report', async () => {
    const useCase = await setup();

    expect(
      (await useCase.execute({ actor: employee, companyId: 'c1' })).canCreate,
    ).toBe(true);
  });

  it('does not offer to create a report to an inactive employee', async () => {
    const useCase = await setup(EmployeeStatus.INACTIVE);

    const list = await useCase.execute({ actor: employee, companyId: 'c1' });

    expect(list.canCreate).toBe(false);
    expect(list.reports.map((report) => report.label)).toEqual(['Lyon']);
  });

  it('refuses another company', async () => {
    const useCase = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employer', async () => {
    const useCase = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, role: UserRole.EMPLOYER },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
