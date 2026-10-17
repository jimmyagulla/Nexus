import { DocumentFileLink } from '@hexagonal-monorepo-template/domain';
import {
  IDocumentGateway,
  IDownloadDocumentFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class DownloadDocumentFromSessionUseCase
  implements IDownloadDocumentFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly documents: IDocumentGateway,
  ) {}

  async execute(documentId: string): Promise<DocumentFileLink> {
    const session = await currentCompanySession(this.sessions);
    return this.documents.download(session.companyId, documentId, session.token);
  }
}
