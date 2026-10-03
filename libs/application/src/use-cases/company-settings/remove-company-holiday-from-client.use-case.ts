import {
  CompanySettingsDto,
  CompanySettingsRepository,
} from '@hexagonal-monorepo-template/ports';

export class RemoveCompanyHolidayFromClientUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(companyId: string, holidayId: string): Promise<CompanySettingsDto> {
    return this.repository.removeHoliday(companyId, holidayId);
  }
}
