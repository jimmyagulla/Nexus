import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanySettingsGateway,
  ISessionGateway,
  ISetNonWorkingWeekdaysFromSession,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

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
    const session = await currentCompanySession(this.sessions);
    return this.companySettings.setNonWorkingWeekdays(
      session.companyId,
      weekdays,
      session.token,
    );
  }
}
