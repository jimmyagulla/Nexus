import {
  CompanyScopedSession,
  CompanySettingsSnapshot,
  DayOfWeek,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanySettingsGateway,
  ISessionGateway,
  ISetNonWorkingWeekdaysFromSession,
} from '@hexagonal-monorepo-template/ports';

export class SetNonWorkingWeekdaysFromSessionUseCase
  implements ISetNonWorkingWeekdaysFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companySettings: ICompanySettingsGateway,
  ) {}

  async execute(
    weekdays: readonly DayOfWeek[],
  ): Promise<CompanySettingsSnapshot> {
    const session = await this.currentCompanySession();
    return this.companySettings.setNonWorkingWeekdays(
      session.companyId,
      weekdays,
      session.token,
    );
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
