import type { PersonalInfoUpdatedViewModel } from './personal-info.view-models';

/**
 * Presents the contact details update confirmation.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class PersonalInfoUpdatedPresenter {
  constructor(private readonly placeholder: PersonalInfoUpdatedViewModel) {}

  present(): PersonalInfoUpdatedViewModel {
    return this.placeholder;
  }
}
