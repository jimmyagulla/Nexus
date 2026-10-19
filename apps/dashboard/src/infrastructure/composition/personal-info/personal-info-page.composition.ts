import {
  GetPersonalInfoFromSessionUseCase,
  UpdatePersonalContactFromSessionUseCase,
} from '@hexagonal-monorepo-template/application';
import {
  IHttpClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { PersonalInfoController } from '../../../adapters/controllers/personal-info.controller';
import { ApiPersonalInfoGateway } from '../../../adapters/gateways/api-personal-info.gateway';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { ConfirmChangesPresenter } from '../../../adapters/presenters/personal-info/confirm-changes.presenter';
import { ContactFieldsPresenter } from '../../../adapters/presenters/personal-info/contact-fields.presenter';
import { EditableInfoPresenter } from '../../../adapters/presenters/personal-info/editable-info.presenter';
import { EmployerInfoPresenter } from '../../../adapters/presenters/personal-info/employer-info.presenter';
import { LocalDatePresenter } from '../../../adapters/presenters/personal-info/local-date.presenter';
import { PersonalInfoLastUpdatePresenter } from '../../../adapters/presenters/personal-info/personal-info-last-update.presenter';

/** Presenters of the screen itself: one per view model. */
export type PersonalInfoViewPresenters = {
  lastUpdate: PersonalInfoLastUpdatePresenter;
  contact: EditableInfoPresenter;
  employer: EmployerInfoPresenter;
};

/** Presenters of the edition modal and its recap. */
export type PersonalInfoEditPresenters = {
  fields: ContactFieldsPresenter;
  changes: ConfirmChangesPresenter;
};

export type PersonalInfoPageComposition = {
  controller: PersonalInfoController;
  viewPresenters: PersonalInfoViewPresenters;
  editPresenters: PersonalInfoEditPresenters;
  errorPresenter: ErrorPresenter;
};

export function createPersonalInfoPageComposition(
  httpClient: IHttpClient,
  sessions: ISessionGateway,
): PersonalInfoPageComposition {
  const personalInfos = new ApiPersonalInfoGateway(httpClient);
  const dates = new LocalDatePresenter();

  return {
    controller: new PersonalInfoController(
      new GetPersonalInfoFromSessionUseCase(sessions, personalInfos),
      new UpdatePersonalContactFromSessionUseCase(sessions, personalInfos),
    ),
    viewPresenters: {
      lastUpdate: new PersonalInfoLastUpdatePresenter(dates),
      contact: new EditableInfoPresenter(),
      employer: new EmployerInfoPresenter(),
    },
    editPresenters: {
      fields: new ContactFieldsPresenter(),
      changes: new ConfirmChangesPresenter(),
    },
    errorPresenter: new ErrorPresenter(),
  };
}
