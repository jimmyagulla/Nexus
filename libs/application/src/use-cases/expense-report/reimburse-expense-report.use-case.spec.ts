import {
  FixedClock,
  InMemoryAuditLogRepository,
  InMemoryExpenseReportRepository,
  InMemoryNotificationRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  AuditAction,
  AuditSubject,
  ErrorCode,
  ExpenseDetails,
  ExpenseReport,
  ExpenseReportLabel,
  ExpenseReportStatus,
  NotificationType,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ReimburseExpenseReportUseCase } from './reimburse-expense-report.use-case';

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const now = new Date('2026-10-08T09:00:00.000Z');

function advance(
  report: ExpenseReport,
  status: ExpenseReportStatus,
): ExpenseReport {
  const submitted = report.submit();
  if (status === ExpenseReportStatus.SUBMITTED) {
    return submitted;
  }
  const reviewed = submitted.startReview();
  if (status === ExpenseReportStatus.UNDER_REVIEW) {
    return reviewed;
  }
  if (status === ExpenseReportStatus.REFUSED) {
    return reviewed.refuse();
  }
  const validated = reviewed.validate();
  return status === ExpenseReportStatus.REIMBURSED
    ? validated.reimburse()
    : validated;
}

async function setup(options: { status?: ExpenseReportStatus } = {}) {
  const status = options.status ?? ExpenseReportStatus.VALIDATED;
  const reports = new InMemoryExpenseReportRepository();
  const notifications = new InMemoryNotificationRepository();
  const audits = new InMemoryAuditLogRepository();
  const created = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
  for (const [categoryId, amount] of [
    ['restaurant', 45],
    ['parking', 12],
    ['train', 68],
  ] as const) {
    await reports.insertExpense(
      created.id,
      ExpenseDetails.parse({
        date: '2026-10-05',
        categoryId,
        amount,
        vat: null,
        paymentMethod: 'Carte',
        description: 'Dépense',
        assignment: 'Client',
      }),
    );
  }
  await reports.insertReceipt(
    created.id,
    ReceiptDetails.parse({
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      content: new Uint8Array([1, 2, 3]),
      expenseId: null,
    }),
  );
  const stored = await reports.findById('c1', created.id);
  if (stored === null) {
    throw new Error('unreachable');
  }
  if (status !== ExpenseReportStatus.DRAFT) {
    await reports.save(advance(stored, status));
  }
  return {
    reports,
    notifications,
    audits,
    report: created,
    useCase: new ReimburseExpenseReportUseCase(
      reports,
      notifications,
      audits,
      new FixedClock(now),
    ),
  };
}

describe('ReimburseExpenseReportUseCase', () => {
  it('marks a validated report as reimbursed', async () => {
    const { useCase, report } = await setup();

    const reimbursed = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(reimbursed.status).toBe(ExpenseReportStatus.REIMBURSED);
  });

  it('reimburses the total of the report, no less', async () => {
    const { useCase, report } = await setup();

    const reimbursed = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(reimbursed.total).toBe(125);
    expect(reimbursed.reimbursedAmount).toBe(125);
  });

  it('stores the reimbursement', async () => {
    const { useCase, reports, report } = await setup();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });
    const stored = await reports.findById('c1', report.id);

    expect(stored?.status).toBe(ExpenseReportStatus.REIMBURSED);
    expect(stored?.reimbursedAmount?.euros).toBe(125);
  });

  it('tells the employee who wrote the report', async () => {
    const { useCase, notifications, report } = await setup();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(await notifications.listByCompany('c1')).toEqual([
      expect.objectContaining({
        type: NotificationType.EXPENSE_REPORT_REIMBURSED,
        recipient: { kind: 'USER', userId: 'e1' },
        companyId: 'c1',
        target: { kind: 'EXPENSE_REPORT', id: report.id },
        createdAt: now,
        read: false,
      }),
    ]);
  });

  it.each([
    ExpenseReportStatus.SUBMITTED,
    ExpenseReportStatus.UNDER_REVIEW,
    ExpenseReportStatus.REFUSED,
    ExpenseReportStatus.REIMBURSED,
  ])(
    'does not reimburse a report that is %s, nor notify anybody',
    async (status) => {
      const { useCase, reports, notifications, report } = await setup({
        status,
      });

      await expect(
        useCase.execute({
          actor: employer,
          companyId: 'c1',
          reportId: report.id,
        }),
      ).rejects.toThrow(ErrorCode.REQUEST_ALREADY_PROCESSED);
      expect((await reports.findById('c1', report.id))?.status).toBe(status);
      expect(await notifications.listByCompany('c1')).toEqual([]);
    },
  );

  it('records in the audit log who did what, when, and the total', async () => {
    const { useCase, audits, report } = await setup();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    const [event, ...others] = await audits.listByCompany('c1');
    expect(others).toEqual([]);
    expect(event).toMatchObject({
      companyId: 'c1',
      actorId: 'u1',
      occurredAt: now,
      action: AuditAction.STATUS_CHANGE,
      subject: AuditSubject.EXPENSE_REPORT,
      after: { expenseReportId: report.id },
    });
    expect(event?.after?.expenseReportTotal).toBeGreaterThan(0);
    expect(event?.sentence).toContain('remboursée');
    expect(event?.sentence?.toLowerCase()).not.toContain('professionnel');
  });

  it('writes nothing in the audit log when the decision is refused', async () => {
    const { useCase, audits, report } = await setup({
      status: ExpenseReportStatus.REIMBURSED,
    });

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.REQUEST_ALREADY_PROCESSED);
    expect(await audits.listByCompany('c1')).toEqual([]);
  });

  it('hides a draft from the employer', async () => {
    const { useCase, report } = await setup({
      status: ExpenseReportStatus.DRAFT,
    });

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', reportId: report.id }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
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
});
