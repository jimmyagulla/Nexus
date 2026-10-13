import { PersonalInfoUpdatedPresenter } from '../../adapters/presenters/personal-info/personal-info-updated.presenter';

export type PersonalInfoUpdatedComposition = {
  presenter: PersonalInfoUpdatedPresenter;
};

export function createPersonalInfoUpdatedComposition(): PersonalInfoUpdatedComposition {
  return { presenter: new PersonalInfoUpdatedPresenter() };
}
