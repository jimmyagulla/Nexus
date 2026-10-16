import {
  CompanyScopedSession,
  DocumentList,
  DocumentListCriteria,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentGateway,
  IListDocumentsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ListDocumentsFromSessionUseCase
  implements IListDocumentsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly documents: IDocumentGateway,
  ) {}

  async execute(criteria: DocumentListCriteria): Promise<DocumentList> {
    const session = await this.currentCompanySession();
    return this.documents.list(session.companyId, criteria, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
