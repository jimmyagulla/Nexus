import { PersonalInfoPresenter } from '../../adapters/presenters/personal-info/personal-info.presenter';

export type PersonalInfoComposition = {
  presenter: PersonalInfoPresenter;
};

export function createPersonalInfoComposition(): PersonalInfoComposition {
  return { presenter: new PersonalInfoPresenter() };
}
