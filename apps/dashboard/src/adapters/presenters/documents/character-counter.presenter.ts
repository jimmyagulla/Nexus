import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

/** "12/250" */
export type CharacterCounterLabel = string;

/** Presents the counter under a text field limited in length. */
export class CharacterCounterPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(length: number, max: number): CharacterCounterLabel {
    return this.i18n.messages.documents.upload.counter
      .replace('{count}', String(length))
      .replace('{max}', String(max));
  }
}
