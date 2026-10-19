import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

/** "Bulletins_2026.zip" */
export type PayslipArchiveName = string;

/** Presents the name the archive of a year of payslips is saved under. */
export class PayslipArchiveNamePresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(year: number): PayslipArchiveName {
    return this.i18n.messages.payslips.list.archiveName.replace('{year}', String(year));
  }
}
