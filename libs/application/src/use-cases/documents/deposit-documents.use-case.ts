import {
  ActorContext,
  Document,
  DocumentDeposit,
  DocumentDepositRequest,
  documentFileFormatSpec,
  DocumentStatus,
  DocumentSummary,
  OwnerScope,
  prepareDocumentDeposit,
  requireOwnerScope,
  toDocumentSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IDepositDocuments,
  IDocumentFileStorage,
  IDocumentRepository,
  NewDocument,
} from '@hexagonal-monorepo-template/ports';

export class DepositDocumentsUseCase implements IDepositDocuments {
  constructor(
    private readonly documents: IDocumentRepository,
    private readonly files: IDocumentFileStorage,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    request: DocumentDepositRequest;
  }): Promise<DocumentSummary[]> {
    const scope = requireOwnerScope(input.actor);
    const deposit = prepareDocumentDeposit(input.request);
    const keys = await this.storeFiles(scope, deposit);
    const recorded = await this.recordDocuments(scope, deposit, keys);
    return recorded.map(toDocumentSummary);
  }

  /** Stores every file; when one fails, the files already stored are removed. */
  private async storeFiles(
    scope: OwnerScope,
    deposit: DocumentDeposit,
  ): Promise<string[]> {
    const keys: string[] = [];
    try {
      for (const file of deposit.files) {
        keys.push(
          await this.files.store({
            folder: `${scope.companyId}/${scope.ownerId}`,
            contentType: documentFileFormatSpec(file.format).mimeType,
            content: file.content,
          }),
        );
      }
      return keys;
    } catch (error) {
      await this.removeFiles(keys);
      throw error;
    }
  }

  /** Records the documents; when recording fails, their files are removed. */
  private async recordDocuments(
    scope: OwnerScope,
    deposit: DocumentDeposit,
    keys: readonly string[],
  ): Promise<Document[]> {
    try {
      return await this.documents.insertAll(
        this.toNewDocuments(scope, deposit, keys),
      );
    } catch (error) {
      await this.removeFiles(keys);
      throw error;
    }
  }

  private toNewDocuments(
    scope: OwnerScope,
    deposit: DocumentDeposit,
    keys: readonly string[],
  ): NewDocument[] {
    const createdAt = this.clock.now();
    return deposit.files.map((file, index) => ({
      companyId: scope.companyId,
      ownerId: scope.ownerId,
      uploadedById: scope.ownerId,
      name: file.name,
      category: deposit.category,
      status: DocumentStatus.PENDING,
      format: file.format,
      sizeBytes: file.sizeBytes,
      comment: deposit.comment,
      storageKey: keys[index],
      createdAt,
    }));
  }

  private async removeFiles(keys: readonly string[]): Promise<void> {
    await Promise.allSettled(keys.map((key) => this.files.remove(key)));
  }
}
