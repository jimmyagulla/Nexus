import {
  ActorContext,
  ExpenseReport,
  ExpenseReportProof,
  ExpenseReportRevision,
  ExpenseReportRevisionDraft,
  ExpenseReportSummary,
  prepareExpenseReportRevision,
  requireOwnedExpenseReport,
  requireOwnerScope,
  toExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportProofStorage,
  IExpenseReportRepository,
  IReviseExpenseReport,
} from '@hexagonal-monorepo-template/ports';
import { storeExpenseReportProof } from '../../expense-reports/store-expense-report-proof';

export class ReviseExpenseReportUseCase implements IReviseExpenseReport {
  constructor(
    private readonly reports: IExpenseReportRepository,
    private readonly proofs: IExpenseReportProofStorage,
  ) {}

  async execute(input: {
    actor: ActorContext;
    expenseReportId: string;
    revision: ExpenseReportRevision;
  }): Promise<ExpenseReportSummary> {
    const report = requireOwnedExpenseReport(
      await this.reports.findById(input.expenseReportId),
      input.actor,
    );
    report.requireEditable();
    const draft = prepareExpenseReportRevision(input.revision);
    const proof = await this.nextProof(input.actor, report, draft);
    const revised = await this.save(report.revise(draft.details, proof), proof, report.proof);
    return toExpenseReportSummary(revised);
  }

  /** A new receipt replaces the one attached; without one, it stays or goes. */
  private async nextProof(
    actor: ActorContext,
    report: ExpenseReport,
    draft: ExpenseReportRevisionDraft,
  ): Promise<ExpenseReportProof | null> {
    if (draft.proof !== null) {
      return storeExpenseReportProof(this.proofs, requireOwnerScope(actor), draft.proof);
    }
    return draft.keepProof ? report.proof : null;
  }

  /**
   * Saves the report, then removes the receipt it no longer carries. When
   * saving fails, the receipt just stored is removed instead.
   */
  private async save(
    revised: ExpenseReport,
    proof: ExpenseReportProof | null,
    previous: ExpenseReportProof | null,
  ): Promise<ExpenseReport> {
    const stored = proof !== null && proof !== previous ? proof : null;
    try {
      await this.reports.save(revised);
    } catch (error) {
      if (stored !== null) {
        await this.proofs.remove(stored.storageKey);
      }
      throw error;
    }
    if (previous !== null && previous !== proof) {
      await this.proofs.remove(previous.storageKey);
    }
    return revised;
  }
}
