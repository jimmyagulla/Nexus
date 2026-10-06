import {
  CompanySettingsSnapshot,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ICompanySettingsGateway } from '../domain/company-settings.gateway';
import { ISessionGateway } from '../domain/session.gateway';

export class LoadCompanySettingsUseCase {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly companies: ICompanySettingsGateway,
  ) {}

  async execute(): Promise<CompanySettingsSnapshot> {
    const token = await this.sessions.getAccessToken();
    const actor = await this.sessions.getActor();
    if (token === null || actor?.companyId === null || actor === null) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return this.companies.get(actor.companyId, token);
  }
}
