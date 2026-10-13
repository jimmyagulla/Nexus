import {
  createPersonalInfoPageComposition,
  type PersonalInfoPageComposition,
} from './personal-info-page.composition';
import {
  createPersonalInfoEditPageComposition,
  type PersonalInfoEditPageComposition,
} from './personal-info-edit-page.composition';
import {
  createPersonalInfoUpdatedPageComposition,
  type PersonalInfoUpdatedPageComposition,
} from './personal-info-updated-page.composition';

/** Compositions of the personal info pages. */
export type PersonalInfoComposition = {
  personalInfo: PersonalInfoPageComposition;
  personalInfoEdit: PersonalInfoEditPageComposition;
  personalInfoUpdated: PersonalInfoUpdatedPageComposition;
};

export function createPersonalInfoComposition(): PersonalInfoComposition {
  return {
    personalInfo: createPersonalInfoPageComposition(),
    personalInfoEdit: createPersonalInfoEditPageComposition(),
    personalInfoUpdated: createPersonalInfoUpdatedPageComposition(),
  };
}
