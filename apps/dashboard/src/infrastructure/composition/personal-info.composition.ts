import { PersonalInfoEditPresenter } from '../../adapters/presenters/personal-info/personal-info-edit.presenter';
import { PersonalInfoPresenter } from '../../adapters/presenters/personal-info/personal-info.presenter';
import { PersonalInfoUpdatedPresenter } from '../../adapters/presenters/personal-info/personal-info-updated.presenter';
import { personalInfoEditFixture, personalInfoFixture, personalInfoUpdatedFixture } from '../ui/fixtures/personal-info.fixture';

export type PersonalInfoComposition = {
  personalInfoPresenter: PersonalInfoPresenter;
  personalInfoEditPresenter: PersonalInfoEditPresenter;
  personalInfoUpdatedPresenter: PersonalInfoUpdatedPresenter;
};

/** Presenters of the personal info screens, fed with placeholder data for now. */
export function createPersonalInfoComposition(): PersonalInfoComposition {
  return {
    personalInfoPresenter: new PersonalInfoPresenter(personalInfoFixture),
    personalInfoEditPresenter: new PersonalInfoEditPresenter(personalInfoEditFixture),
    personalInfoUpdatedPresenter: new PersonalInfoUpdatedPresenter(personalInfoUpdatedFixture),
  };
}
