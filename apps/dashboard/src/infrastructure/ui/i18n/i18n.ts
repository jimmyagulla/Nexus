import { en } from './en';
import { fr } from './fr';

type StringTree<T> = {
  [K in keyof T]: T[K] extends string ? string : StringTree<T[K]>;
};

export type Messages = StringTree<typeof fr>;

export class I18n {
  constructor(
    private readonly catalogs: { fr: Messages } & Record<string, Messages>,
    private readonly locale = 'fr',
  ) {}

  get messages(): Messages {
    return this.catalogs[this.language] ?? this.catalogs.fr;
  }

  private get language(): string {
    return this.locale.split('-')[0] ?? 'fr';
  }
}

export const i18n = new I18n({ fr, en });
