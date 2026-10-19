import { PersonalInfoSnapshot } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { LocalDatePresenter } from './local-date.presenter';

/** "Dernière mise à jour le 12/06/2026" */
export type PersonalInfoLastUpdateModel = string;

/** Presents the date of the last change, under the title of the screen. */
export class PersonalInfoLastUpdatePresenter {
  constructor(
    private readonly dates: LocalDatePresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  present(info: PersonalInfoSnapshot): PersonalInfoLastUpdateModel {
    return this.i18n.messages.personalInfo.view.lastUpdate.replace(
      '{date}',
      this.dates.present(new Date(info.updatedAt)).day,
    );
  }
}
