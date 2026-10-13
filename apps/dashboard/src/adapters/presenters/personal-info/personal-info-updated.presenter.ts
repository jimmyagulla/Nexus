import type { EditableInfoModel } from './personal-info.presenter';

export interface PersonalInfoUpdatedViewModel {
  /** "Le service RH a été informé le … Un e-mail de confirmation vous a été envoyé." */
  notice: string;
  lastUpdate: string;
  contact: EditableInfoModel[];
}

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
