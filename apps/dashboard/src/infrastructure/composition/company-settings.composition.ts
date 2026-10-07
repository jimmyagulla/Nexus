import {
  AddCompanyPublicHolidayFromSessionUseCase,
  GetCompanySettingsFromSessionUseCase,
  RemoveCompanyPublicHolidayFromSessionUseCase,
  RenameCompanyFromSessionUseCase,
  SetNonWorkingWeekdaysFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  ApiCompanyPublicHolidaysGateway,
  ApiCompanySettingsGateway,
} from '@hexagonal-monorepo-template/adapters';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsController } from '../../adapters/controllers/company-settings.controller';
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
