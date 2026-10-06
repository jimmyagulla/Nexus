import {
  CompanySettingsSnapshot,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ICompanyPublicHolidaysGateway } from '@hexagonal-monorepo-template/ports';

export class InMemoryCompanyPublicHolidaysGateway
  implements ICompanyPublicHolidaysGateway
{
  constructor(
    private readonly accessToken: string,
    private readonly snapshots: Map<string, CompanySettingsSnapshot>,
  ) {}

  async add(
    companyId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.replace(companyId, token, (snapshot) => ({
      ...snapshot,
      publicHolidays: [
        ...snapshot.publicHolidays,
        { id: `${date}-${label}`, date, label },
      ],
    }));
  }

  async update(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.replace(companyId, token, (snapshot) => ({
      ...this.requireRetained(snapshot, publicHolidayId),
      publicHolidays: snapshot.publicHolidays.map((holiday) =>
        holiday.id === publicHolidayId ? { id: holiday.id, date, label } : holiday,
      ),
    }));
  }

  async remove(
    companyId: string,
    publicHolidayId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.replace(companyId, token, (snapshot) => ({
      ...this.requireRetained(snapshot, publicHolidayId),
      publicHolidays: snapshot.publicHolidays.filter(
        (holiday) => holiday.id !== publicHolidayId,
      ),
    }));
  }

  snapshotOf(companyId: string): CompanySettingsSnapshot {
    return this.read(companyId, this.accessToken);
  }

  private requireRetained(
    snapshot: CompanySettingsSnapshot,
    publicHolidayId: string,
  ): CompanySettingsSnapshot {
    if (
      !snapshot.publicHolidays.some((holiday) => holiday.id === publicHolidayId)
    ) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }

    return snapshot;
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
