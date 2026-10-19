import {
  ActorContext,
  documentFileFormatSpec,
  ErrorCode,
  ExpenseReportProofLink,
  requireReadableExpenseReport,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportProofStorage,
  IExpenseReportRepository,
  IViewExpenseReportProof,
} from '@hexagonal-monorepo-template/ports';

export class ViewExpenseReportProofUseCase implements IViewExpenseReportProof {
  constructor(
    private readonly reports: IExpenseReportRepository,
    private readonly proofs: IExpenseReportProofStorage,
  ) {}

  async execute(input: {
    actor: ActorContext;
    expenseReportId: string;
  }): Promise<ExpenseReportProofLink> {
    const report = requireReadableExpenseReport(
      await this.reports.findById(input.expenseReportId),
      input.actor,
    );
    if (report.proof === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return {
      url: await this.proofs.linkTo(report.proof.storageKey, { downloadAs: null }),
      fileName: report.proof.fileName,
      contentType: documentFileFormatSpec(report.proof.format).mimeType,
    };
  }
}
