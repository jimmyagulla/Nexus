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
  ExpenseDetails,
  ExpenseDetailsInput,
  ExpenseReportLabel,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { UpdateExpenseUseCase } from './update-expense.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const changed: ExpenseDetailsInput = {
  date: '2026-10-06',
  categoryId: 'train',
  amount: 70,
  vat: 10,
  paymentMethod: 'Espèces',
  description: 'Billet retour',
  assignment: 'Projet X',
};

async function setup(status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  const reports = new InMemoryExpenseReportRepository();
  const categories = new InMemoryExpenseCategoryRepository();
  const useCase = new UpdateExpenseUseCase(
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
  const restaurant = await reports.insertExpense(
    report.id,
    ExpenseDetails.parse({
      date: '2026-10-05',
      categoryId: 'restaurant',
      amount: 45,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Déjeuner',
      assignment: 'Client Dupont',
    }),
  );
  const train = await reports.insertExpense(
    report.id,
    ExpenseDetails.parse({
      date: '2026-10-05',
      categoryId: 'train',
      amount: 68,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Billet',
      assignment: 'Projet X',
    }),
  );
  return { reports, categories, useCase, report, restaurant, train };
}

describe('UpdateExpenseUseCase', () => {
  it('replaces the details of the expense and recomputes the total', async () => {
    const { useCase, report, train } = await setup();

    const updated = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      expenseId: train.id,
      expense: changed,
    });

    expect(updated.total).toBe(115);
    expect(updated.expenses.find((item) => item.id === train.id)).toMatchObject(
      {
        date: '2026-10-06',
        amount: 70,
        vat: 10,
        paymentMethod: 'Espèces',
        description: 'Billet retour',
      },
    );
  });

  it('keeps the other expenses untouched', async () => {
    const { useCase, report, restaurant, train } = await setup();

    const updated = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      expenseId: train.id,
      expense: changed,
    });

    expect(updated.expenses.map((item) => item.id)).toEqual([
      restaurant.id,
      train.id,
    ]);
    expect(updated.expenses[0]?.amount).toBe(45);
  });

  it('stores the modification', async () => {
    const { useCase, reports, report, train } = await setup();

    await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      expenseId: train.id,
      expense: changed,
    });

    expect(
      (await reports.findById('c1', report.id))?.total().euros,
    ).toBe(115);
  });

  it('refuses a zero amount and keeps the expense as it was', async () => {
    const { useCase, reports, report, train } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expenseId: train.id,
        expense: { ...changed, amount: 0 },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_AMOUNT);
    expect((await reports.findById('c1', report.id))?.total().euros).toBe(113);
  });

  it('refuses a VAT above the amount', async () => {
    const { useCase, report, train } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expenseId: train.id,
        expense: { ...changed, vat: 71 },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_VAT);
  });

  it('refuses a category the company does not offer', async () => {
    const { useCase, report, train } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expenseId: train.id,
        expense: { ...changed, categoryId: 'unknown' },
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses an expense the report does not hold', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        expenseId: 'unknown',
        expense: changed,
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
        expense: changed,
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
        expense: changed,
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
        expense: changed,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
