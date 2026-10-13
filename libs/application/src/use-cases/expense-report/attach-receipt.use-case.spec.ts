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
  ReceiptDetailsInput,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AttachReceiptUseCase } from './attach-receipt.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

const ticket: ReceiptDetailsInput = {
  fileName: 'ticket.pdf',
  mimeType: 'application/pdf',
  content: new Uint8Array([1, 2, 3]),
  expenseId: null,
};

async function setup(status: EmployeeStatus = EmployeeStatus.ACTIVE) {
  const reports = new InMemoryExpenseReportRepository();
  const useCase = new AttachReceiptUseCase(
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
  return { reports, useCase, report, train };
}

describe('AttachReceiptUseCase', () => {
  it('keeps the receipt on the draft report', async () => {
    const { useCase, report } = await setup();

    const updated = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      receipt: ticket,
    });

    expect(updated.receipts).toEqual([
      expect.objectContaining({
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        size: 3,
        expenseId: null,
      }),
    ]);
  });

  it('keeps a receipt that proves one expense', async () => {
    const { useCase, report, train } = await setup();

    const updated = await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      receipt: { ...ticket, expenseId: train.id },
    });

    expect(updated.receipts[0]?.expenseId).toBe(train.id);
  });

  it('stores the receipt so that it survives on the note', async () => {
    const { useCase, reports, report } = await setup();

    await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
      receipt: ticket,
    });

    expect((await reports.findById('c1', report.id))?.receipts).toHaveLength(1);
  });

  it('accepts a report that stays a draft without receipt', async () => {
    const { reports, report } = await setup();

    expect((await reports.findById('c1', report.id))?.receipts).toEqual([]);
  });

  it.each([
    ['text/plain', new Uint8Array([1])],
    ['application/pdf', new Uint8Array()],
  ])('refuses an invalid file (%s)', async (mimeType, content) => {
    const { useCase, reports, report } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        receipt: { ...ticket, mimeType, content },
      }),
    ).rejects.toThrow(ErrorCode.INVALID_FILE);
    expect((await reports.findById('c1', report.id))?.receipts).toEqual([]);
  });

  it('refuses a receipt for an expense the report does not hold', async () => {
    const { useCase, reports, report } = await setup();

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        receipt: { ...ticket, expenseId: 'unknown' },
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect((await reports.findById('c1', report.id))?.receipts).toEqual([]);
  });

  it('refuses an inactive employee', async () => {
    const { useCase, report } = await setup(EmployeeStatus.INACTIVE);

    await expect(
      useCase.execute({
        actor: employee,
        companyId: 'c1',
        reportId: report.id,
        receipt: ticket,
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
        receipt: ticket,
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
        receipt: ticket,
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
