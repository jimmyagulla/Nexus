import type { PersonalInfoEditViewModel } from './personal-info.view-models';

/**
 * Presents the contact details edition.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class PersonalInfoEditPresenter {
  constructor(private readonly placeholder: PersonalInfoEditViewModel) {}

  present(): PersonalInfoEditViewModel {
    return this.placeholder;
  }
}
