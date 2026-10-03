import {
  CompanySettingsDto,
  CompanySettingsGateway,
} from '@hexagonal-monorepo-template/ports';

export class AddCompanyHolidayFromClientUseCase {
  constructor(private readonly gateway: CompanySettingsGateway) {}

  execute(
    companyId: string,
    date: string,
    label: string,
  ): Promise<CompanySettingsDto> {
    return this.gateway.addHoliday(companyId, date, label);
  }
}
