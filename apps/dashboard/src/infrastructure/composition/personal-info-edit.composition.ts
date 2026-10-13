import { PersonalInfoEditPresenter } from '../../adapters/presenters/personal-info/personal-info-edit.presenter';

export type PersonalInfoEditComposition = {
  presenter: PersonalInfoEditPresenter;
};

export function createPersonalInfoEditComposition(): PersonalInfoEditComposition {
  return { presenter: new PersonalInfoEditPresenter() };
}
