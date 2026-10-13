import {
  ActorContext,
  assertSameCompany,
  ReceiptFileSnapshot,
  requireVisibleExpenseReport,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportRepository,
  IGetReceipt,
} from '@hexagonal-monorepo-template/ports';

export class GetReceiptUseCase implements IGetReceipt {
  constructor(private readonly reports: IExpenseReportRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    receiptId: string;
  }): Promise<ReceiptFileSnapshot> {
    assertSameCompany(input.companyId, input.actor.companyId);
    const report = requireVisibleExpenseReport(
      await this.reports.findById(input.companyId, input.reportId),
      input.actor,
    );
    const receipt = report.requireReceipt(input.receiptId);
    return {
      id: receipt.id,
      fileName: receipt.details.fileName,
      mimeType: receipt.details.mimeType,
      content: receipt.details.content,
    };
  }
}
