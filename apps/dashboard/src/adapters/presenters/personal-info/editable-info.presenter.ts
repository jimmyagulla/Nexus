import {
  PERSONAL_CONTACT_FIELDS,
  PersonalContactField,
  PersonalContactValues,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

export interface EditableInfoModel {
  id: PersonalContactField;
  label: string;
  value: string;
}

/** Presents the rows of the "Informations modifiables par vous" card. */
export class EditableInfoPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(contact: PersonalContactValues): EditableInfoModel[] {
    const labels = this.i18n.messages.personalInfo.fields;
    return PERSONAL_CONTACT_FIELDS.map((field) => ({
      id: field,
      label: labels[field],
      value: contact[field],
    }));
  }
}
