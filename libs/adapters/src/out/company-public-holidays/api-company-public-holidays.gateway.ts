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
  ICompanyPublicHolidaysGateway,
  IHttpClient,
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

export class ApiCompanyPublicHolidaysGateway
  implements ICompanyPublicHolidaysGateway
{
  constructor(private readonly httpClient: IHttpClient) {}

  async add(
    companyId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.post<ApiResponse<CompanySettingsPayload>>(
        companyPath(API_ROUTES.companies.publicHolidays, { companyId }),
        { date, label },
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  async update(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.patch<ApiResponse<CompanySettingsPayload>>(
        this.holidayPath(companyId, publicHolidayId),
        { date, label },
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  async remove(
    companyId: string,
    publicHolidayId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot> {
    const payload = unwrapResponse(
      await this.httpClient.delete<ApiResponse<CompanySettingsPayload>>(
        this.holidayPath(companyId, publicHolidayId),
        this.authorized(token),
      ),
    );
    return this.toSnapshot(payload);
  }

  private holidayPath(companyId: string, publicHolidayId: string): string {
    return companyPath(API_ROUTES.companies.publicHoliday, {
      companyId,
      publicHolidayId,
    });
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
