import {
  CompanyScopedSession,
  DocumentFileLink,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentGateway,
  ISessionGateway,
  IViewDocumentFromSession,
} from '@hexagonal-monorepo-template/ports';

export class ViewDocumentFromSessionUseCase implements IViewDocumentFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly documents: IDocumentGateway,
  ) {}

  async execute(documentId: string): Promise<DocumentFileLink> {
    const session = await this.currentCompanySession();
    return this.documents.view(session.companyId, documentId, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
