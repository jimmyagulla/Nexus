import {
  changedPersonalContactFields,
  PersonalContactField,
  PersonalContactValues,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

export interface ChangeModel {
  id: PersonalContactField;
  label: string;
  previous: string;
  next: string;
}

export interface ConfirmChangesModel {
  changes: ChangeModel[];
  /** "Un e-mail de confirmation sera envoyé à … et le service RH sera informé." */
  emailNotice: string;
}

/** Presents the recap of the changed contact details, before they are saved. */
export class ConfirmChangesPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(previous: PersonalContactValues, next: PersonalContactValues): ConfirmChangesModel {
    const messages = this.i18n.messages.personalInfo;
    return {
      changes: changedPersonalContactFields(previous, next).map((field) => ({
        id: field,
        label: messages.fields[field],
        previous: previous[field],
        next: next[field].trim(),
      })),
      emailNotice: messages.confirm.emailNotice.replace('{email}', next.email.trim()),
    };
  }
}
