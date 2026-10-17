import {
  DocumentDepositRequest,
  DocumentSummary,
  prepareDocumentDeposit,
} from '@hexagonal-monorepo-template/domain';
import {
  IDepositDocumentsFromSession,
  IDocumentGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

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
    const session = await currentCompanySession(this.sessions);
    return this.documents.deposit(session.companyId, deposit, session.token);
  }
}
