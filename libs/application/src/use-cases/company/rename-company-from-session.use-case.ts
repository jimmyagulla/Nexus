import {
  CompanyScopedSession,
  CompanySettingsSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanySettingsGateway,
  IRenameCompanyFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class RenameCompanyFromSessionUseCase
  implements IRenameCompanyFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companySettings: ICompanySettingsGateway,
  ) {}

  async execute(name: string): Promise<CompanySettingsSnapshot> {
    const session = await this.currentCompanySession();
    return this.companySettings.rename(session.companyId, name, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
