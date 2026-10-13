import {
  InMemoryEmployeeRepository,
  InMemoryExpenseReportRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Employee,
  EmployeeStatus,
  ErrorCode,
  ExpenseDetails,
  ExpenseReportLabel,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { RemoveExpenseUseCase } from './remove-expense.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

function details(categoryId: string, amount: number): ExpenseDetails {
  return ExpenseDetails.parse({
    date: '2026-10-05',
    categoryId,
    amount,
    vat: null,
    paymentMethod: 'Carte',
    description: 'Dépense',
    assignment: 'Client',
  });
}

async function setup(status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  const reports = new InMemoryExpenseReportRepository();
  const useCase = new RemoveExpenseUseCase(
    new InMemoryEmployeeRepository([
      new Employee('e1', 'c1', status),
      new Employee('e2', 'c1', EmployeeStatus.ACTIVE),
    ]),
    reports,
  );
  const report = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
  await reports.insertExpense(report.id, details('restaurant', 45));
  await reports.insertExpense(report.id, details('parking', 12));
  const train = await reports.insertExpense(report.id, details('train', 68));
  return { reports, useCase, report, train };
}

describe('RemoveExpenseUseCase', () => {
  it('lowers the total from 125 to 57 when the train is removed', async () => {
    const { useCase, report, train } = await setup();

    const updated = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      expenseId: train.id,
    });

    expect(updated.total).toBe(57);
    expect(updated.expenses.map((item) => item.categoryId)).toEqual([
      'restaurant',
      'parking',
    ]);
  });

  it('stores the removal', async () => {
    const { useCase, reports, report, train } = await setup();

    await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      expenseId: train.id,
    });

    expect((await reports.findById('c1', report.id))?.total().euros).toBe(57);
  });

  it('refuses an expense the report does not hold', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expenseId: 'unknown',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an inactive employee', async () => {
    const { useCase, report, train } = await setup(EmployeeStatus.INACTIVE);

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expenseId: train.id,
      }),
    ).rejects.toThrow(ErrorCode.INACTIVE_EMPLOYEE);
  });

  it('refuses the report of another employee without saying it exists', async () => {
    const { useCase, report, train } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e2' },
        companyId: 'c1',
        reportId: report.id,
        expenseId: train.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employer', async () => {
    const { useCase, report, train } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, role: UserRole.EMPLOYER },
        companyId: 'c1',
        reportId: report.id,
        expenseId: train.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
