import {
  CompanySettingsDto,
  CompanySettingsGateway,
} from '@hexagonal-monorepo-template/ports';

export class RemoveCompanyHolidayFromClientUseCase {
  constructor(private readonly gateway: CompanySettingsGateway) {}

  execute(companyId: string, holidayId: string): Promise<CompanySettingsDto> {
    return this.gateway.removeHoliday(companyId, holidayId);
  }
}
