export interface PersonalInfoEditViewModel {
  fields: ContactFieldModel[];
  confirmation: ConfirmChangesModel;
}

export interface ChangeModel {
  id: string;
  label: string;
  previous: string;
  next: string;
}

export interface ConfirmChangesModel {
  changes: ChangeModel[];
  /** "Un e-mail de confirmation sera envoyé à … et le service RH sera informé." */
  emailNotice: string;
}

export interface ContactFieldModel {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'tel' | 'email';
  /** Differs from the saved value: blue 2px border. */
  modified?: boolean;
}

/**
 * Presents the contact details edition.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class PersonalInfoEditPresenter {
  present(personalInfoEdit: PersonalInfoEditViewModel): PersonalInfoEditViewModel {
    return personalInfoEdit;
  }
}
