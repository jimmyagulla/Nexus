import type { PersonalInfoViewModel } from './personal-info.view-models';

/**
 * Presents the personal information.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class PersonalInfoPresenter {
  constructor(private readonly placeholder: PersonalInfoViewModel) {}

  present(): PersonalInfoViewModel {
    return this.placeholder;
  }
}
