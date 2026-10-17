import { DocumentFileLink } from '@hexagonal-monorepo-template/domain';
import {
  IDocumentGateway,
  ISessionGateway,
  IViewDocumentFromSession,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class ViewDocumentFromSessionUseCase implements IViewDocumentFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly documents: IDocumentGateway,
  ) {}

  async execute(documentId: string): Promise<DocumentFileLink> {
    const session = await currentCompanySession(this.sessions);
    return this.documents.view(session.companyId, documentId, session.token);
  }
}
