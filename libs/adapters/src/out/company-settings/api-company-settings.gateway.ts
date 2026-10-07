import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import {
  ApiResponse,
  unwrapResponse,
} from '@hexagonal-monorepo-template/infrastructure';
import {
  API_ROUTES,
  companyPath,
  HttpClient,
  ICompanySettingsGateway,
} from '@hexagonal-monorepo-template/ports';

type PublicHolidayPayload = {
  id: string;
  date: string;
  label: string;
};

type CompanySettingsPayload = {
  id: string;
  name: string;
  nonWorkingWeekdays: DayOfWeek[];
  publicHolidays: PublicHolidayPayload[];
};

export class ApiCompanySettingsGateway implements ICompanySettingsGateway {
  constructor(private readonly httpClient: HttpClient) {}

  async get(
    companyId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.get<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.settings, { companyId }),
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  async rename(
    companyId: string,
    name: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.patch<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.name, { companyId }),
        { name },
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  async setNonWorkingWeekdays(
    companyId: string,
    weekdays: readonly DayOfWeek[],
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.put<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.nonWorkingWeekdays, { companyId }),
        { weekdays },
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  private authorized(token: string): { headers: { Authorization: string } } {
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  private toSnapshot(payload: CompanySettingsPayload): CompanySettingsSnapshot {
    return {
      id: payload.id,
      name: payload.name,
      nonWorkingWeekdays: [...payload.nonWorkingWeekdays],
      publicHolidays: payload.publicHolidays.map((holiday) => ({
        id: holiday.id,
        date: holiday.date,
        label: holiday.label,
      })),
    };
  }
}
