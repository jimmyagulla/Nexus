import { PersonalInfoPresenter } from '../../../adapters/presenters/personal-info/personal-info.presenter';

export type PersonalInfoPageComposition = {
  presenter: PersonalInfoPresenter;
};

export function createPersonalInfoPageComposition(): PersonalInfoPageComposition {
  return { presenter: new PersonalInfoPresenter() };
}
