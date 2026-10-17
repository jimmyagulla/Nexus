import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  ICompanySettingsGateway,
  IRenameCompanyFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class RenameCompanyFromSessionUseCase
  implements IRenameCompanyFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companySettings: ICompanySettingsGateway,
  ) {}

  async execute(name: string): Promise<CompanySettingsSnapshot> {
    const session = await currentCompanySession(this.sessions);
    return this.companySettings.rename(session.companyId, name, session.token);
  }
}
