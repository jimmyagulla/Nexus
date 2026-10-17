import {
  DocumentList,
  DocumentListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  IDocumentGateway,
  IListDocumentsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class ListDocumentsFromSessionUseCase
  implements IListDocumentsFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly documents: IDocumentGateway,
  ) {}

  async execute(criteria: DocumentListCriteria): Promise<DocumentList> {
    const session = await currentCompanySession(this.sessions);
    return this.documents.list(session.companyId, criteria, session.token);
  }
}
