import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

/** "Vos 2 documents ont été transmis au service RH." */
export type DepositConfirmationMessage = string;

/** Presents the confirmation shown once documents are sent. */
export class DepositConfirmationPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(count: number): DepositConfirmationMessage {
    const upload = this.i18n.messages.documents.upload;
    return count === 1
      ? upload.sentOne
      : upload.sentOther.replace('{count}', String(count));
  }
}
