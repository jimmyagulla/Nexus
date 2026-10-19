import {
  PERSONAL_CONTACT_FIELDS,
  PersonalContactField,
  PersonalContactValues,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

export interface ContactFieldModel {
  id: PersonalContactField;
  label: string;
  /** The saved value: the field starts from it. */
  value: string;
  type: 'text' | 'tel' | 'email';
}

const FIELD_TYPES: Record<PersonalContactField, ContactFieldModel['type']> = {
  address: 'text',
  postalCodeAndCity: 'text',
  phone: 'tel',
  email: 'email',
};

/** Presents the fields of the contact details edition. */
export class ContactFieldsPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(contact: PersonalContactValues): ContactFieldModel[] {
    const labels = this.i18n.messages.personalInfo.fields;
    return PERSONAL_CONTACT_FIELDS.map((field) => ({
      id: field,
      label: labels[field],
      value: contact[field],
      type: FIELD_TYPES[field],
    }));
  }
}
