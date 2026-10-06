import {
  AddCompanyPublicHolidayFromSessionUseCase,
  GetCompanySettingsFromSessionUseCase,
  RemoveCompanyPublicHolidayFromSessionUseCase,
  RenameCompanyFromSessionUseCase,
  SetNonWorkingWeekdaysFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/controllers/company-settings.controller';
import { ApiCompanyPublicHolidaysGateway } from '../../adapters/gateways/api-company-public-holidays.gateway';
import { ApiCompanySettingsGateway } from '../../adapters/gateways/api-company-settings.gateway';
import { CompanySettingsPresenter } from '../../adapters/presenters/company-settings.presenter';
import { ErrorPresenter } from '../../adapters/presenters/error.presenter';

export type CompanySettingsComposition = {
  controller: CompanySettingsController;
  presenter: CompanySettingsPresenter;
  errorPresenter: ErrorPresenter;
};

export function createCompanySettingsComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): CompanySettingsComposition {
  const companySettings = new ApiCompanySettingsGateway(httpClient);
  const publicHolidays = new ApiCompanyPublicHolidaysGateway(httpClient);

  return {
    controller: new CompanySettingsController(
      new GetCompanySettingsFromSessionUseCase(sessions, companySettings),
      new RenameCompanyFromSessionUseCase(sessions, companySettings),
      new SetNonWorkingWeekdaysFromSessionUseCase(sessions, companySettings),
      new AddCompanyPublicHolidayFromSessionUseCase(sessions, publicHolidays),
      new RemoveCompanyPublicHolidayFromSessionUseCase(
        sessions,
        publicHolidays,
      ),
    ),
    presenter: new CompanySettingsPresenter(),
    errorPresenter: new ErrorPresenter(),
  };
}
