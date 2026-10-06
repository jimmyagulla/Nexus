import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ICompanySettingsGateway } from '@hexagonal-monorepo-template/ports';

export class InMemoryCompanySettingsGateway
  implements ICompanySettingsGateway
{
  constructor(
    private readonly accessToken: string,
    private readonly snapshots: Map<string, CompanySettingsSnapshot>,
  ) {}

  async get(
    companyId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.read(companyId, token);
  }

  async rename(
    companyId: string,
    name: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.replace(companyId, token, (snapshot) => ({
      ...snapshot,
      name,
    }));
  }

  async setNonWorkingWeekdays(
    companyId: string,
    weekdays: readonly DayOfWeek[],
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.replace(companyId, token, (snapshot) => ({
      ...snapshot,
      nonWorkingWeekdays: [...weekdays],
    }));
  }

  snapshotOf(companyId: string): CompanySettingsSnapshot {
    return this.read(companyId, this.accessToken);
  }

  private read(
    companyId: string,
    token: string,
  ): CompanySettingsSnapshot {
    const snapshot = this.snapshots.get(companyId);
    if (token !== this.accessToken || snapshot === undefined) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }

    return snapshot;
  }

  private replace(
    companyId: string,
    token: string,
    change: (snapshot: CompanySettingsSnapshot) => CompanySettingsSnapshot,
  ): CompanySettingsSnapshot {
    const next = change(this.read(companyId, token));
    this.snapshots.set(companyId, next);
    return next;
  }
}
