import {
  CompanyScopedSession,
  DocumentFileLink,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentGateway,
  IDownloadDocumentFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class DownloadDocumentFromSessionUseCase
  implements IDownloadDocumentFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly documents: IDocumentGateway,
  ) {}

  async execute(documentId: string): Promise<DocumentFileLink> {
    const session = await this.currentCompanySession();
    return this.documents.download(session.companyId, documentId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
