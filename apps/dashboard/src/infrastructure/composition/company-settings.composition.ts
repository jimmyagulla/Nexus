import { HttpClient } from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/controllers/company-settings.controller';
import { ApiCompanySettingsGateway } from '../../adapters/gateways/api-company-settings.gateway';
import { AddCompanyHolidayFromClientUseCase } from '../../application/company-settings/add-company-holiday-from-client.use-case';
import { CreateCompanyFromClientUseCase } from '../../application/company-settings/create-company-from-client.use-case';
import { LoadCompanySettingsUseCase } from '../../application/company-settings/load-company-settings.use-case';
import { RemoveCompanyHolidayFromClientUseCase } from '../../application/company-settings/remove-company-holiday-from-client.use-case';
import { UpdateCompanyNameFromClientUseCase } from '../../application/company-settings/update-company-name-from-client.use-case';
import { UpdateNonWorkingWeekdaysFromClientUseCase } from '../../application/company-settings/update-non-working-weekdays-from-client.use-case';

export type CompanySettingsComposition = {
  controller: CompanySettingsController;
};

export function createCompanySettingsComposition(
  httpClient: HttpClient,
): CompanySettingsComposition {
  const gateway = new ApiCompanySettingsGateway(httpClient);
  return {
    controller: new CompanySettingsController(
      new LoadCompanySettingsUseCase(gateway),
      new CreateCompanyFromClientUseCase(gateway),
      new UpdateCompanyNameFromClientUseCase(gateway),
      new UpdateNonWorkingWeekdaysFromClientUseCase(gateway),
      new AddCompanyHolidayFromClientUseCase(gateway),
      new RemoveCompanyHolidayFromClientUseCase(gateway),
    ),
  };
}
