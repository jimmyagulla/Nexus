import {
  CompanySettingsDto,
  CompanySettingsRepository,
} from '@hexagonal-monorepo-template/ports';

export class UpdateNonWorkingWeekdaysFromClientUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(companyId: string, weekdays: number[]): Promise<CompanySettingsDto> {
    return this.repository.updateNonWorkingWeekdays(companyId, weekdays);
  }
}
