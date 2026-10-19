import {
  documentFileFormatSpec,
  ExpenseReportProof,
  OwnerScope,
  PreparedExpenseReportProof,
} from '@hexagonal-monorepo-template/domain';
import { IExpenseReportProofStorage } from '@hexagonal-monorepo-template/ports';

/**
 * Stores a checked receipt in the folder of its owner and describes it as
 * the report keeps it. A step the submission and the revision share, not a
 * use case.
 */
export async function storeExpenseReportProof(
  proofs: IExpenseReportProofStorage,
  scope: OwnerScope,
  proof: PreparedExpenseReportProof,
): Promise<ExpenseReportProof> {
  const storageKey = await proofs.store({
    folder: `${scope.companyId}/${scope.ownerId}`,
    contentType: documentFileFormatSpec(proof.format).mimeType,
    content: proof.content,
  });
  return {
    fileName: proof.fileName,
    format: proof.format,
    sizeBytes: proof.sizeBytes,
    storageKey,
  };
}
