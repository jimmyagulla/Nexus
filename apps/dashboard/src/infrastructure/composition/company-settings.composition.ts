import {
  AddCompanyHolidayFromClientUseCase,
  CreateCompanyFromClientUseCase,
  LoadCompanySettingsUseCase,
  RemoveCompanyHolidayFromClientUseCase,
  UpdateCompanyNameFromClientUseCase,
  UpdateNonWorkingWeekdaysFromClientUseCase,
} from '@hexagonal-monorepo-template/application';
import { HttpClient } from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/controllers/company-settings/company-settings.controller';
import { ApiCompanySettingsGateway } from '../../adapters/gateways/company-settings/api-company-settings.gateway';
import { AuditEventPresenter } from '../../adapters/presenters/audit-event/audit-event.presenter';
import { CompanySettingsPresenter } from '../../adapters/presenters/company-settings/company-settings.presenter';

export type CompanySettingsComposition = {
  controller: CompanySettingsController;
  presenter: CompanySettingsPresenter;
  auditPresenter: AuditEventPresenter;
};

export function createCompanySettingsComposition(
  httpClient: HttpClient,
): CompanySettingsComposition {
  const repository = new ApiCompanySettingsGateway(httpClient);
  return {
    controller: new CompanySettingsController(
      new LoadCompanySettingsUseCase(repository),
      new CreateCompanyFromClientUseCase(repository),
      new UpdateCompanyNameFromClientUseCase(repository),
      new UpdateNonWorkingWeekdaysFromClientUseCase(repository),
      new AddCompanyHolidayFromClientUseCase(repository),
      new RemoveCompanyHolidayFromClientUseCase(repository),
    ),
    presenter: new CompanySettingsPresenter(),
    auditPresenter: new AuditEventPresenter(),
  };
}
