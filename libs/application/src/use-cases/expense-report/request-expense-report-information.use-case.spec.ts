import {
  FixedClock,
  InMemoryExpenseReportRepository,
  InMemoryNotificationRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  ExpenseDetails,
  ExpenseReport,
  ExpenseReportLabel,
  ExpenseReportStatus,
  NotificationType,
  ReceiptDetails,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { RequestExpenseReportInformationUseCase } from './request-expense-report-information.use-case';

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

const now = new Date('2026-10-07T09:00:00.000Z');

function advance(
  report: ExpenseReport,
  status: ExpenseReportStatus,
): ExpenseReport {
  const submitted = report.submit();
  if (status === ExpenseReportStatus.SUBMITTED) {
    return submitted;
  }
  const reviewed = submitted.startReview();
  if (status === ExpenseReportStatus.VALIDATED) {
    return reviewed.validate();
  }
  if (status === ExpenseReportStatus.REFUSED) {
    return reviewed.refuse();
  }
  return reviewed;
}

async function setup(options: { status?: ExpenseReportStatus } = {}) {
  const status = options.status ?? ExpenseReportStatus.UNDER_REVIEW;
  const reports = new InMemoryExpenseReportRepository();
  const notifications = new InMemoryNotificationRepository();
  const created = await reports.insert(
    'c1',
    'e1',
    ExpenseReportLabel.parse('Déplacement Lyon'),
  );
  await reports.insertExpense(
    created.id,
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
    report: created,
    useCase: new RequestExpenseReportInformationUseCase(reports, notifications, new FixedClock(now)),
  };
}

describe('RequestExpenseReportInformationUseCase', () => {
  it('asks the employee for more information without changing the status', async () => {
    const { useCase, report } = await setup();

    const decided = await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(decided.status).toBe(ExpenseReportStatus.UNDER_REVIEW);
  });

  it('stores the decision', async () => {
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

  it('tells the employee who wrote the report', async () => {
    const { useCase, notifications, report } = await setup();

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect(await notifications.listByCompany('c1')).toEqual([
      expect.objectContaining({
        type: NotificationType.EXPENSE_REPORT_INFORMATION_REQUESTED,
        recipient: { kind: 'USER', userId: 'e1' },
        companyId: 'c1',
        target: { kind: 'EXPENSE_REPORT', id: report.id },
        createdAt: now,
        read: false,
      }),
    ]);
  });

  it('is possible for a report that is only submitted, and keeps it submitted', async () => {
    const { useCase, reports, notifications, report } = await setup({
      status: ExpenseReportStatus.SUBMITTED,
    });

    await useCase.execute({
      actor: employer,
      companyId: 'c1',
      reportId: report.id,
    });

    expect((await reports.findById('c1', report.id))?.status).toBe(
      ExpenseReportStatus.SUBMITTED,
    );
    expect(await notifications.listByCompany('c1')).toHaveLength(1);
  });

  it('can be repeated while the report is waiting', async () => {
    const { useCase, notifications, report } = await setup();
    const input = { actor: employer, companyId: 'c1', reportId: report.id };

    await useCase.execute(input);
    await useCase.execute(input);

    expect(await notifications.listByCompany('c1')).toHaveLength(2);
  });

  it.each([ExpenseReportStatus.VALIDATED, ExpenseReportStatus.REFUSED])(
    'answers a request already processed when the report is %s and notifies nobody',
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
