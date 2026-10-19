import {
  documentFileFormatSpec,
  ErrorCode,
  ExpenseReport,
  ExpenseReportDraft,
  ExpenseReportList,
  ExpenseReportListCriteria,
  ExpenseReportProof,
  ExpenseReportProofLink,
  ExpenseReportRevisionDraft,
  ExpenseReportStatus,
  ExpenseReportSummary,
  PreparedExpenseReportProof,
  toExpenseReportList,
  toExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';
import { toDataUrl } from '@hexagonal-monorepo-template/infrastructure';
import {
  IClock,
  IExpenseReportGateway,
  IIdGenerator,
} from '@hexagonal-monorepo-template/ports';

/** An expense report of the in-memory API, with its receipt. */
export type InMemoryApiExpenseReport = {
  report: ExpenseReport;
  proofContent: Uint8Array | null;
};

/**
 * The expense reports of the API, kept in the process. A token stands for
 * the person it was issued to: they only reach their own reports. A link is
 * a `data:` URL carrying the receipt itself.
 */
export class InMemoryExpenseReportGateway implements IExpenseReportGateway {
  constructor(
    private readonly ids: IIdGenerator,
    private readonly clock: IClock,
    private readonly reports = new Map<string, InMemoryApiExpenseReport>(),
  ) {}

  async list(
    companyId: string,
    criteria: ExpenseReportListCriteria,
    token: string,
  ): Promise<ExpenseReportList> {
    const owned = [...this.reports.values()]
      .map(({ report }) => report)
      .filter((report) => report.isOwnedBy(companyId, token));
    return toExpenseReportList(owned, criteria, this.clock.now());
  }

  async submit(
    companyId: string,
    draft: ExpenseReportDraft,
    token: string,
  ): Promise<ExpenseReportSummary> {
    const report = new ExpenseReport({
      ...draft.details,
      id: this.ids.next(),
      companyId,
      ownerId: token,
      proof: this.proofOf(companyId, token, draft.proof),
      status: ExpenseReportStatus.SUBMITTED,
      submittedAt: this.clock.now(),
      processedAt: null,
    });
    this.reports.set(report.id, { report, proofContent: draft.proof?.content ?? null });
    return toExpenseReportSummary(report);
  }

  async revise(
    companyId: string,
    expenseReportId: string,
    draft: ExpenseReportRevisionDraft,
    token: string,
  ): Promise<ExpenseReportSummary> {
    const stored = this.owned(companyId, expenseReportId, token);
    const keeps = draft.proof === null && draft.keepProof;
    const report = stored.report.revise(
      draft.details,
      keeps ? stored.report.proof : this.proofOf(companyId, token, draft.proof),
    );
    this.reports.set(report.id, {
      report,
      proofContent: keeps ? stored.proofContent : draft.proof?.content ?? null,
    });
    return toExpenseReportSummary(report);
  }

  async viewProof(
    companyId: string,
    expenseReportId: string,
    token: string,
  ): Promise<ExpenseReportProofLink> {
    const { report, proofContent } = this.owned(companyId, expenseReportId, token);
    if (report.proof === null || proofContent === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    const contentType = documentFileFormatSpec(report.proof.format).mimeType;
    return {
      url: toDataUrl(contentType, proofContent),
      fileName: report.proof.fileName,
      contentType,
    };
  }

  /** A report of someone else is refused exactly like a missing one. */
  private owned(
    companyId: string,
    expenseReportId: string,
    token: string,
  ): InMemoryApiExpenseReport {
    const stored = this.reports.get(expenseReportId);
    if (stored === undefined || !stored.report.isOwnedBy(companyId, token)) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return stored;
  }

  private proofOf(
    companyId: string,
    token: string,
    proof: PreparedExpenseReportProof | null,
  ): ExpenseReportProof | null {
    return proof === null
      ? null
      : {
          fileName: proof.fileName,
          format: proof.format,
          sizeBytes: proof.sizeBytes,
          storageKey: `${companyId}/${token}/${this.ids.next()}`,
        };
  }
}
