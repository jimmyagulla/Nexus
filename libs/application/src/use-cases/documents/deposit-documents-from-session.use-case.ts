import {
  CompanyScopedSession,
  DocumentDepositRequest,
  DocumentSummary,
  prepareDocumentDeposit,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IDepositDocumentsFromSession,
  IDocumentGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

/**
 * Checks the deposit with the same rules as the API before sending it, so
 * that a file too large or of the wrong format never leaves the device.
 */
export class DepositDocumentsFromSessionUseCase
  implements IDepositDocumentsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly documents: IDocumentGateway,
  ) {}

  async execute(request: DocumentDepositRequest): Promise<DocumentSummary[]> {
    const deposit = prepareDocumentDeposit(request);
    const session = await this.currentCompanySession();
    return this.documents.deposit(session.companyId, deposit, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
