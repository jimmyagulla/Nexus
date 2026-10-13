import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseDetails,
  ExpenseReportLabel,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetExpenseReportUseCase } from './get-expense-report.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

async function setup() {
  const reports = new InMemoryExpenseReportRepository();
  const report = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
  return { useCase: new GetExpenseReportUseCase(reports), report };
}

describe('GetExpenseReportUseCase', () => {
  it('shows the employee her own draft report', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: report.id }),
    ).resolves.toMatchObject({
      id: report.id,
      label: 'Déplacement Lyon',
      status: 'DRAFT',
    });
  });

  it('shows the employer a submitted report with its receipts', async () => {
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
    const stored = await reports.findById('c1', report.id);
    if (stored === null) {
      throw new Error('unreachable');
    }
    await reports.save(stored.submit());

    const seen = await new GetExpenseReportUseCase(reports).execute({
      actor: { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER },
      companyId: 'c1',
      reportId: report.id,
    });

    expect(seen.status).toBe('SUBMITTED');
    expect(seen.total).toBe(68);
    expect(seen.receipts.map((receipt) => receipt.fileName)).toEqual([
      'ticket.pdf',
    ]);
  });

  it('hides a draft from the employer', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { userId: 'u1', companyId: 'c1', role: UserRole.EMPLOYER },
        companyId: 'c1',
        reportId: report.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('hides the report of another employee', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e2' },
        companyId: 'c1',
        reportId: report.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('hides an unknown report', async () => {
    const { useCase } = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: 'nope' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('hides the report from another company', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: { ...employee, companyId: 'c2' },
        companyId: 'c2',
        reportId: report.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses an actor reading another company than hers', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({ actor: employee, companyId: 'c2', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
