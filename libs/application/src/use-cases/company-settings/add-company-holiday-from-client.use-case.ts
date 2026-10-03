import {
  CompanySettingsDto,
  CompanySettingsRepository,
} from '@hexagonal-monorepo-template/ports';

export class AddCompanyHolidayFromClientUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(
    companyId: string,
    date: string,
    label: string,
  ): Promise<CompanySettingsDto> {
    return this.repository.addHoliday(companyId, date, label);
  }
}
