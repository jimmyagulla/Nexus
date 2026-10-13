import {
  ActorContext,
  ExpenseReport,
  ExpenseReportSnapshot,
  ReceiptDetails,
  ReceiptDetailsInput,
  requireActiveEmployeeActor,
  requireOwnExpenseReport,
  toExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  IAttachReceipt,
  IEmployeeRepository,
  IExpenseReportRepository,
} from '@hexagonal-monorepo-template/ports';

export class AttachReceiptUseCase implements IAttachReceipt {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    receipt: ReceiptDetailsInput;
  }): Promise<ExpenseReportSnapshot> {
    requireActiveEmployeeActor(
      input.actor,
      input.companyId,
      await this.employees.findById(input.companyId, input.actor.userId),
    );
    const report = await this.loadDraftReport(input);
    const details = ReceiptDetails.parse(input.receipt);
    if (details.expenseId !== null) {
      report.requireExpense(details.expenseId);
    }
    const receipt = await this.reports.insertReceipt(report.id, details);
    return toExpenseReportSnapshot(report.attachReceipt(receipt));
  }

  private async loadDraftReport(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReport> {
    const report = requireOwnExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
    report.requireDraft();
    return report;
  }
}
