export interface PersonalInfoViewModel {
  /** "Dernière mise à jour le 12/06/2026" */
  lastUpdate: string;
  contact: EditableInfoModel[];
  employer: EmployerInfoModel[];
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
