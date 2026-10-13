import { InMemoryExpenseReportRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseDetails,
  ExpenseReportLabel,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { GetReceiptUseCase } from './get-receipt.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

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
  const receipt = await reports.insertReceipt(
    report.id,
    ReceiptDetails.parse({
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
      expenseId: null,
    }),
  );
  if (options.submitted ?? false) {
    const stored = await reports.findById('c1', report.id);
    if (stored === null) {
      throw new Error('unreachable');
    }
    await reports.save(stored.submit());
  }
  return { useCase: new GetReceiptUseCase(reports), report, receipt };
}

describe('GetReceiptUseCase', () => {
  it('gives the employee the file of her own receipt', async () => {
    const { useCase, report, receipt } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        receiptId: receipt.id,
      }),
    ).resolves.toEqual({
      id: receipt.id,
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
    });
  });

  it('gives the employer the file of a submitted report', async () => {
    const { useCase, report, receipt } = await setup({ submitted: true });

    const file = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
      receiptId: receipt.id,
    });

    expect(file.fileName).toBe('ticket.pdf');
  });

  it('hides the file of a draft from the employer', async () => {
    const { useCase, report, receipt } = await setup();

    await expect(
      useCase.execute({
        actor: employer,
        companyId: 'c1',
        reportId: report.id,
        receiptId: receipt.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('hides the file from another employee', async () => {
    const { useCase, report, receipt } = await setup({ submitted: true });

    await expect(
      useCase.execute({
        actor: { ...employee, userId: 'e2' },
        companyId: 'c1',
        reportId: report.id,
        receiptId: receipt.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses a receipt the report does not hold', async () => {
    const { useCase, report } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        receiptId: 'unknown',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses another company', async () => {
    const { useCase, report, receipt } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c2',
        reportId: report.id,
        receiptId: receipt.id,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
