import {
  API_ROUTES,
  ApiResponse,
  companyPath,
  CompanySettingsDto,
  CompanySettingsGateway,
  HttpClient,
} from '@hexagonal-monorepo-template/ports';
import { unwrapResponse } from '@hexagonal-monorepo-template/infrastructure';

export class ApiCompanySettingsGateway implements CompanySettingsGateway {
  constructor(private readonly httpClient: HttpClient) {}

  async create(name: string): Promise<CompanySettingsDto> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<CompanySettingsDto>>(
        API_ROUTES.companies.base,
        { name },
      ),
    );
  }

  async find(companyId: string): Promise<CompanySettingsDto> {
    return unwrapResponse(
      await this.httpClient.get<ApiResponse<CompanySettingsDto>>(
        companyPath(API_ROUTES.companies.settings, { companyId }),
        this.actor(companyId),
      ),
    );
  }

  async updateName(companyId: string, name: string): Promise<CompanySettingsDto> {
    return unwrapResponse(
      await this.httpClient.patch<ApiResponse<CompanySettingsDto>>(
        companyPath(API_ROUTES.companies.name, { companyId }),
        { name },
        this.actor(companyId),
      ),
    );
  }

  async updateNonWorkingWeekdays(
    companyId: string,
    weekdays: number[],
  ): Promise<CompanySettingsDto> {
    return unwrapResponse(
      await this.httpClient.put<ApiResponse<CompanySettingsDto>>(
        companyPath(API_ROUTES.companies.nonWorkingWeekdays, { companyId }),
        { weekdays },
        this.actor(companyId),
      ),
    );
  }

  async addHoliday(
    companyId: string,
    date: string,
    label: string,
  ): Promise<CompanySettingsDto> {
    return unwrapResponse(
      await this.httpClient.post<ApiResponse<CompanySettingsDto>>(
        companyPath(API_ROUTES.companies.holidays, { companyId }),
        { date, label },
        this.actor(companyId),
      ),
    );
  }

  async removeHoliday(
    companyId: string,
    holidayId: string,
  ): Promise<CompanySettingsDto> {
    return unwrapResponse(
      await this.httpClient.delete<ApiResponse<CompanySettingsDto>>(
        companyPath(API_ROUTES.companies.holiday, { companyId, holidayId }),
        this.actor(companyId),
      ),
    );
  }

  private actor(companyId: string) {
    return { headers: { 'x-company-id': companyId } };
  }
}
