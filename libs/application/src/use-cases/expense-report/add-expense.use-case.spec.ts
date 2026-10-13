import {
  InMemoryEmployeeRepository,
  InMemoryExpenseCategoryRepository,
  InMemoryExpenseReportRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Employee,
  EmployeeStatus,
  ErrorCode,
  ExpenseDetailsInput,
  ExpenseReportLabel,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AddExpenseUseCase } from './add-expense.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const restaurant: ExpenseDetailsInput = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner client',
  assignment: 'Client Dupont',
};

async function setup(status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  const reports = new InMemoryExpenseReportRepository();
  const categories = new InMemoryExpenseCategoryRepository();
  const useCase = new AddExpenseUseCase(
    new InMemoryEmployeeRepository([
      new Employee('e1', 'c1', status),
      new Employee('e2', 'c1', EmployeeStatus.ACTIVE),
    ]),
    reports,
    categories,
  );
  const report = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
  return { reports, categories, useCase, report };
}

describe('AddExpenseUseCase', () => {
  it('adds an expense to the draft report', async () => {
    const { useCase, report } = await setup();

    const updated = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      expense: restaurant,
    });

    expect(updated.expenses).toEqual([
      expect.objectContaining({
        date: '2026-10-05',
        categoryId: 'restaurant',
        amount: 45,
        vat: null,
        paymentMethod: 'Carte',
        description: 'Déjeuner client',
        assignment: 'Client Dupont',
      }),
    ]);
  });

  it('gathers Restaurant 45, Parking 12 and Train 68 in one report', async () => {
    const { useCase, reports, report } = await setup();
    const add = (categoryId: string, amount: number) =>
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expense: { ...restaurant, categoryId, amount },
      });

    await add('restaurant', 45);
    await add('parking', 12);
    const final = await add('train', 68);
    const stored = await reports.findById('c1', report.id);

    expect(final.expenses.map((item) => item.amount)).toEqual([45, 12, 68]);
    expect(final.total).toBe(125);
    expect(stored?.expenses.map((item) => item.details.categoryId)).toEqual([
      'restaurant',
      'parking',
      'train',
    ]);
  });

  it('accepts a category added by the company', async () => {
    const { useCase, categories, report } = await setup();
    const hotel = await categories.insert('c1', 'Hôtel');

    const updated = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      expense: { ...restaurant, categoryId: hotel.id },
    });

    expect(updated.expenses[0]?.categoryId).toBe(hotel.id);
  });

  it('refuses a category of another company', async () => {
    const { useCase, categories, report } = await setup();
    const foreign = await categories.insert('c2', 'Péage');

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expense: { ...restaurant, categoryId: foreign.id },
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses a zero amount and keeps the report empty', async () => {
    const { useCase, reports, report } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expense: { ...restaurant, amount: 0 },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_AMOUNT);
    expect((await reports.findById('c1', report.id))?.expenses).toEqual([]);
  });

  it('refuses a VAT above the amount', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expense: { ...restaurant, vat: 50 },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_VAT);
  });

  it('refuses an inactive employee', async () => {
    const { useCase, report } = await setup(EmployeeStatus.INACTIVE);

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expense: restaurant,
      }),
    ).rejects.toThrow(ErrorCode.INACTIVE_EMPLOYEE);
  });

  it('refuses the report of another employee without saying it exists', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e2' },
        companyId: 'c1',
        reportId: report.id,
        expense: restaurant,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an unknown report', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: 'unknown',
        expense: restaurant,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employer', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, role: UserRole.EMPLOYER },
        companyId: 'c1',
        reportId: report.id,
        expense: restaurant,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
