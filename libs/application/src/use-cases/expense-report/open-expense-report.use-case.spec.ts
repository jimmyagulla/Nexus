import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseDetails,
  ExpenseReportLabel,
  ExpenseReportStatus,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { OpenExpenseReportUseCase } from './open-expense-report.use-case';

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

async function setup(options: { submitted?: boolean } = {}) {
  const reports = new InMemoryExpenseReportRepository();
  const report = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
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
  await reports.insertReceipt(
    report.id,
    ReceiptDetails.parse({
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
      expenseId: null,
    }),
  );
  if (options.submitted ?? true) {
    const stored = await reports.findById('c1', report.id);
    if (stored === null) {
      throw new Error('unreachable');
    }
    await reports.save(stored.submit());
  }
  return { reports, useCase: new OpenExpenseReportUseCase(reports), report };
}

describe('OpenExpenseReportUseCase', () => {
  it('moves a submitted report under review when the employer opens it', async () => {
    const { useCase, report } = await setup();

    const opened = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(opened.status).toBe(ExpenseReportStatus.UNDER_REVIEW);
  });

  it('stores the new status', async () => {
    const { useCase, reports, report } = await setup();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect((await reports.findById('c1', report.id))?.status).toBe(
      ExpenseReportStatus.UNDER_REVIEW,
    );
  });

  it('shows the expenses and the receipts of the report', async () => {
    const { useCase, report } = await setup();

    const opened = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(opened.total).toBe(68);
    expect(opened.receipts.map((receipt) => receipt.fileName)).toEqual([
      'ticket.pdf',
    ]);
  });

  it('keeps the status when the employer opens it again', async () => {
    const { useCase, report } = await setup();
    const input = { actor: employer, companyId: 'c1', reportId: report.id };

    await useCase.execute(input);
    const again = await useCase.execute(input);

    expect(again.status).toBe(ExpenseReportStatus.UNDER_REVIEW);
  });

  it('does not open a draft, which the employer cannot see', async () => {
    const { useCase, reports, report } = await setup({ submitted: false });

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await reports.findById('c1', report.id))?.status).toBe(
      ExpenseReportStatus.DRAFT,
    );
  });

  it('refuses an employee', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE, userId: 'e1' },
        companyId: 'c1',
        reportId: report.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an employer of another company', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employer, companyId: 'c2' },
        companyId: 'c1',
        reportId: report.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an unknown report', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', reportId: 'nope' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
