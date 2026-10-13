import {
  InMemoryEmployeeRepository,
  FixedClock,
  InMemoryAuditLogRepository,
  InMemoryExpenseReportRepository,
  InMemoryNotificationRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  Employee,
  EmployeeStatus,
  AuditAction,
  AuditSubject,
  ErrorCode,
  ExpenseDetails,
  ExpenseReportLabel,
  ExpenseReportStatus,
  NotificationType,
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
  const notifications = new InMemoryNotificationRepository();
  const audits = new InMemoryAuditLogRepository();
  const useCase = new SubmitExpenseReportUseCase(
    new InMemoryEmployeeRepository([
      new Employee('e1', 'c1', options.status ?? EmployeeStatus.ACTIVE),
      new Employee('e2', 'c1', EmployeeStatus.ACTIVE),
    ]),
    reports,
    notifications,
    audits,
    new FixedClock(new Date('2026-10-06T10:00:00.000Z')),
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
  return { reports, notifications, audits, useCase, report };
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

  it('tells the employers that a report was submitted', async () => {
    const { useCase, notifications, report } = await setup();

    await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(await notifications.listByCompany('c1')).toEqual([
      expect.objectContaining({
        type: NotificationType.EXPENSE_REPORT_SUBMITTED,
        recipient: { kind: 'EMPLOYERS' },
        companyId: 'c1',
        target: { kind: 'EXPENSE_REPORT', id: report.id },
        createdAt: new Date('2026-10-06T10:00:00.000Z'),
        read: false,
      }),
    ]);
  });

  it('records in the audit log who submitted what, when, and the total', async () => {
    const { useCase, audits, report } = await setup();

    await useCase.execute({
      actor: employee,
      companyId: 'c1',
      reportId: report.id,
    });

    const [event, ...others] = await audits.listByCompany('c1');
    expect(others).toEqual([]);
    expect(event).toMatchObject({
      companyId: 'c1',
      actorId: 'e1',
      occurredAt: new Date('2026-10-06T10:00:00.000Z'),
      action: AuditAction.TRANSMISSION,
      subject: AuditSubject.EXPENSE_REPORT,
      before: { expenseReportStatus: 'DRAFT', expenseReportTotal: 68 },
      after: { expenseReportStatus: 'SUBMITTED', expenseReportTotal: 68 },
    });
    expect(event?.sentence).toBe(
      'Note de frais « Déplacement Lyon » soumise (68 €).',
    );
  });

  it('does not record the submission twice on a second submission', async () => {
    const { useCase, audits, report } = await setup();
    const input = { actor: employee, companyId: 'c1', reportId: report.id };

    await useCase.execute(input);
    await useCase.execute(input);

    expect(await audits.listByCompany('c1')).toHaveLength(1);
  });

  it('writes nothing in the audit log when a receipt is missing', async () => {
    const { useCase, audits, report } = await setup({ withReceipt: false });

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.MISSING_DOCUMENT);
    expect(await audits.listByCompany('c1')).toEqual([]);
  });

  it('does not create a second report nor a second notification on a second submission', async () => {
    const { useCase, reports, notifications, report } = await setup();
    const input = { actor: employee, companyId: 'c1', reportId: report.id };

    const first = await useCase.execute(input);
    const second = await useCase.execute(input);

    expect(second).toEqual(first);
    expect(second.status).toBe(ExpenseReportStatus.SUBMITTED);
    expect(await reports.list('c1', {})).toHaveLength(1);
    expect(await notifications.listByCompany('c1')).toHaveLength(1);
  });

  it('answers a missing document, keeps the report a draft and notifies nobody', async () => {
    const { useCase, reports, notifications, report } = await setup({
      withReceipt: false,
    });

    await expect(
      useCase.execute({ actor: employee, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.MISSING_DOCUMENT);
    expect((await reports.findById('c1', report.id))?.status).toBe(
      ExpenseReportStatus.DRAFT,
    );
    expect(await notifications.listByCompany('c1')).toEqual([]);
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
