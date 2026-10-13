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
  ExpenseReportStatus,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { SubmitExpenseReportUseCase } from './submit-expense-report.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

async function setup(
  options: {
    status?: EmployeeStatus;
    withExpense?: boolean;
    withReceipt?: boolean;
  } = {},
) {
  const reports = new InMemoryExpenseReportRepository();
  const useCase = new SubmitExpenseReportUseCase(
    new InMemoryEmployeeRepository([
      new Employee('e1', 'c1', options.status ?? EmployeeStatus.ACTIVE),
      new Employee('e2', 'c1', EmployeeStatus.ACTIVE),
    ]),
    reports,
  );
  const report = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
  if (options.withExpense ?? true) {
    await reports.insertExpense(
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
  }
  if (options.withReceipt ?? true) {
    await reports.insertReceipt(
      report.id,
      ReceiptDetails.parse({
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array([1, 2, 3]),
        expenseId: null,
      }),
    );
  }
  return { reports, useCase, report };
}

describe('SubmitExpenseReportUseCase', () => {
  it('submits a report holding an expense and a receipt', async () => {
    const { useCase, report } = await setup();

    const submitted = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(submitted.status).toBe(ExpenseReportStatus.SUBMITTED);
  });

  it('stores the submission', async () => {
    const { useCase, reports, report } = await setup();

    await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
    });

    expect((await reports.findById('c1', report.id))?.status).toBe(
      ExpenseReportStatus.SUBMITTED,
    );
  });

  it('keeps the receipts on the submitted report', async () => {
    const { useCase, report } = await setup();

    const submitted = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(submitted.receipts).toHaveLength(1);
  });

  it('answers a missing document and keeps the report a draft without receipt', async () => {
    const { useCase, reports, report } = await setup({ withReceipt: false });

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.MISSING_DOCUMENT);
    expect((await reports.findById('c1', report.id))?.status).toBe(
      ExpenseReportStatus.DRAFT,
    );
  });

  it('refuses a report without any expense', async () => {
    const { useCase, report } = await setup({ withExpense: false });

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses an inactive employee', async () => {
    const { useCase, report } = await setup({ status: EmployeeStatus.INACTIVE });

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.INACTIVE_EMPLOYEE);
  });

  it('refuses the report of another employee without saying it exists', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e2' },
        companyId: 'c1',
        reportId: report.id,
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
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
