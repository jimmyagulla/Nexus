import {
  ActorContext,
  ExpenseReport,
  ExpenseReportDetails,
  ExpenseReportProof,
  ExpenseReportStatus,
  ExpenseReportSubmission,
  ExpenseReportSummary,
  OwnerScope,
  PreparedExpenseReportProof,
  prepareExpenseReportSubmission,
  requireOwnerScope,
  toExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IExpenseReportProofStorage,
  IExpenseReportRepository,
  ISubmitExpenseReport,
} from '@hexagonal-monorepo-template/ports';
import { storeExpenseReportProof } from '../../expense-reports/store-expense-report-proof';

export class SubmitExpenseReportUseCase implements ISubmitExpenseReport {
  constructor(
    private readonly reports: IExpenseReportRepository,
    private readonly proofs: IExpenseReportProofStorage,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    submission: ExpenseReportSubmission;
  }): Promise<ExpenseReportSummary> {
    const scope = requireOwnerScope(input.actor);
    const draft = prepareExpenseReportSubmission(input.submission);
    const proof = await this.storeProof(scope, draft.proof);
    const recorded = await this.record(scope, draft.details, proof);
    return toExpenseReportSummary(recorded);
  }

  private async storeProof(
    scope: OwnerScope,
    proof: PreparedExpenseReportProof | null,
  ): Promise<ExpenseReportProof | null> {
    return proof === null ? null : storeExpenseReportProof(this.proofs, scope, proof);
  }

  /** Records the report; when recording fails, its receipt is removed. */
  private async record(
    scope: OwnerScope,
    details: ExpenseReportDetails,
    proof: ExpenseReportProof | null,
  ): Promise<ExpenseReport> {
    try {
      return await this.reports.insert({
        ...details,
        companyId: scope.companyId,
        ownerId: scope.ownerId,
        proof,
        status: ExpenseReportStatus.SUBMITTED,
        submittedAt: this.clock.now(),
        processedAt: null,
      });
    } catch (error) {
      if (proof !== null) {
        await this.proofs.remove(proof.storageKey);
      }
      throw error;
    }
  }
}
