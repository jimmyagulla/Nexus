import { PersonalInfoUpdatedPresenter } from '../../../adapters/presenters/personal-info/personal-info-updated.presenter';

export type PersonalInfoUpdatedPageComposition = {
  presenter: PersonalInfoUpdatedPresenter;
};

export function createPersonalInfoUpdatedPageComposition(): PersonalInfoUpdatedPageComposition {
  return { presenter: new PersonalInfoUpdatedPresenter() };
}
