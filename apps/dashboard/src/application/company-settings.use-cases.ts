import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ICompanySettingsGateway } from '../domain/company-settings.gateway';
import { ISessionGateway } from '../domain/session.gateway';

async function requireSession(sessions: ISessionGateway) {
  const token = await sessions.getAccessToken();
  const actor = await sessions.getActor();
  if (token === null || actor?.companyId === null || actor === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return { token, companyId: actor.companyId };
}

export class RenameCompanyFromClientUseCase {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companies: ICompanySettingsGateway,
  ) {}

  async execute(name: string): Promise<CompanySettingsSnapshot> {
    const session = await requireSession(this.sessions);
    return this.companies.rename(session.companyId, name, session.token);
  }
}

export class SetNonWorkingWeekdaysFromClientUseCase {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companies: ICompanySettingsGateway,
  ) {}

  async execute(weekdays: readonly DayOfWeek[]): Promise<CompanySettingsSnapshot> {
    const session = await requireSession(this.sessions);
    return this.companies.setNonWorkingWeekdays(
      session.companyId,
      weekdays,
      session.token,
    );
  }
}

export class AddCompanyPublicHolidayFromClientUseCase {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companies: ICompanySettingsGateway,
  ) {}

  async execute(input: {
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot> {
    const session = await requireSession(this.sessions);
    return this.companies.addPublicHoliday(
      session.companyId,
      input.date,
      input.label,
      session.token,
    );
  }
}

export class RemoveCompanyPublicHolidayFromClientUseCase {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companies: ICompanySettingsGateway,
  ) {}

  async execute(publicHolidayId: string): Promise<CompanySettingsSnapshot> {
    const session = await requireSession(this.sessions);
    return this.companies.removePublicHoliday(
      session.companyId,
      publicHolidayId,
      session.token,
    );
  }
}
