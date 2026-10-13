import { PersonalInfoEditPresenter } from '../../../adapters/presenters/personal-info/personal-info-edit.presenter';

export type PersonalInfoEditPageComposition = {
  presenter: PersonalInfoEditPresenter;
};

export function createPersonalInfoEditPageComposition(): PersonalInfoEditPageComposition {
  return { presenter: new PersonalInfoEditPresenter() };
}
