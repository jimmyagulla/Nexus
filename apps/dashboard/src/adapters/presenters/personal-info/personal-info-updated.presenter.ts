import type { EditableInfoModel } from './personal-info.presenter';

export interface PersonalInfoUpdatedViewModel {
  /** "Le service RH a été informé le … Un e-mail de confirmation vous a été envoyé." */
  notice: string;
  lastUpdate: string;
  contact: EditableInfoModel[];
}

/**
 * Presents the contact details update confirmation.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class PersonalInfoUpdatedPresenter {
  present(personalInfoUpdated: PersonalInfoUpdatedViewModel): PersonalInfoUpdatedViewModel {
    return personalInfoUpdated;
  }
}
