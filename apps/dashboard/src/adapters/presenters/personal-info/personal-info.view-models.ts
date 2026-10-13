/** View models of the personal info screens, produced by their presenters. */

export interface PersonalInfoViewModel {
  /** "Dernière mise à jour le 12/06/2026" */
  lastUpdate: string;
  contact: EditableInfoModel[];
  employer: EmployerInfoModel[];
}

export interface PersonalInfoEditViewModel {
  fields: ContactFieldModel[];
  confirmation: ConfirmChangesViewModel;
}

export interface PersonalInfoUpdatedViewModel {
  /** "Le service RH a été informé le … Un e-mail de confirmation vous a été envoyé." */
  notice: string;
  lastUpdate: string;
  contact: EditableInfoModel[];
}

export interface ChangeModel {
  id: string;
  label: string;
  previous: string;
  next: string;
}

export interface ConfirmChangesViewModel {
  changes: ChangeModel[];
  /** "Un e-mail de confirmation sera envoyé à … et le service RH sera informé." */
  emailNotice: string;
}

export interface EditableInfoModel {
  id: string;
  label: string;
  value: string;
  /** Just changed: tinted green with a "Modifié" tag. */
  modified?: boolean;
}

export interface EmployerInfoModel {
  id: string;
  label: string;
  value: string;
}

export interface ContactFieldModel {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'tel' | 'email';
  /** Differs from the saved value: blue 2px border. */
  modified?: boolean;
}
