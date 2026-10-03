import {
  CompanySettingsDto,
  CompanySettingsGateway,
} from '@hexagonal-monorepo-template/ports';

export class UpdateNonWorkingWeekdaysFromClientUseCase {
  constructor(private readonly gateway: CompanySettingsGateway) {}

  execute(companyId: string, weekdays: number[]): Promise<CompanySettingsDto> {
    return this.gateway.updateNonWorkingWeekdays(companyId, weekdays);
  }
}
